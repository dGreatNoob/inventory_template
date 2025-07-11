<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StockIn;
use App\Models\PurchaseOrder;
use App\Models\Product;
use App\Models\Batch;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class StockInController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $stockIns = StockIn::with(['purchaseOrder', 'items.product', 'batch'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $stockIns,
                'message' => 'Stock in records retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve stock in records',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'purchase_order_id' => 'nullable|exists:purchase_orders,id',
                'batch_id' => 'nullable|exists:batches,id',
                'reference_number' => 'required|string|max:50|unique:stock_ins',
                'receipt_date' => 'required|date',
                'received_by' => 'required|string|max:100',
                'status' => 'required|in:pending,received,verified,rejected',
                'notes' => 'nullable|string',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.unit_cost' => 'required|numeric|min:0',
                'items.*.total_cost' => 'required|numeric|min:0',
                'items.*.expiry_date' => 'nullable|date',
                'items.*.lot_number' => 'nullable|string|max:50',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $stockIn = StockIn::create($request->except('items'));

            // Create stock in items
            foreach ($request->items as $item) {
                $stockIn->items()->create($item);
            }

            // Update product stock levels
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                if ($product) {
                    $product->increment('current_stock', $item['quantity']);
                }
            }

            DB::commit();

            $stockIn->load(['purchaseOrder', 'items.product', 'batch']);

            return response()->json([
                'success' => true,
                'data' => $stockIn,
                'message' => 'Stock in record created successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create stock in record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(StockIn $stockIn): JsonResponse
    {
        try {
            $stockIn->load(['purchaseOrder', 'items.product', 'batch']);

            return response()->json([
                'success' => true,
                'data' => $stockIn,
                'message' => 'Stock in record retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve stock in record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StockIn $stockIn): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'purchase_order_id' => 'nullable|exists:purchase_orders,id',
                'batch_id' => 'nullable|exists:batches,id',
                'reference_number' => 'sometimes|required|string|max:50|unique:stock_ins,reference_number,' . $stockIn->id,
                'receipt_date' => 'sometimes|required|date',
                'received_by' => 'sometimes|required|string|max:100',
                'status' => 'sometimes|required|in:pending,received,verified,rejected',
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $stockIn->update($request->all());
            $stockIn->load(['purchaseOrder', 'items.product', 'batch']);

            return response()->json([
                'success' => true,
                'data' => $stockIn,
                'message' => 'Stock in record updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update stock in record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockIn $stockIn): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Decrease product stock levels
            foreach ($stockIn->items as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $product->decrement('current_stock', $item->quantity);
                }
            }

            // Delete related items first
            $stockIn->items()->delete();
            
            // Delete the stock in record
            $stockIn->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Stock in record deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete stock in record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get purchase orders for dropdown
     */
    public function getPurchaseOrders(): JsonResponse
    {
        try {
            $purchaseOrders = PurchaseOrder::select('id', 'order_number', 'supplier_id')
                ->with('supplier:id,name')
                ->where('status', '!=', 'cancelled')
                ->orderBy('order_date', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $purchaseOrders
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve purchase orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get batches for dropdown
     */
    public function getBatches(): JsonResponse
    {
        try {
            $batches = Batch::select('id', 'batch_number', 'name')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $batches
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve batches',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products for dropdown
     */
    public function getProducts(): JsonResponse
    {
        try {
            $products = Product::select('id', 'name', 'sku', 'cost_price')
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve products',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
