<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $purchaseOrders = PurchaseOrder::with(['supplier', 'items.product'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $purchaseOrders,
                'message' => 'Purchase orders retrieved successfully'
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'supplier_id' => 'required|exists:suppliers,id',
                'order_number' => 'required|string|max:50|unique:purchase_orders',
                'order_date' => 'required|date',
                'expected_delivery_date' => 'nullable|date|after_or_equal:order_date',
                'status' => 'required|in:draft,pending,confirmed,ordered,received,partial,cancelled',
                'payment_status' => 'required|in:pending,partial,paid,overdue',
                'payment_terms' => 'nullable|string|max:100',
                'subtotal' => 'required|numeric|min:0',
                'tax_amount' => 'required|numeric|min:0',
                'discount_amount' => 'required|numeric|min:0',
                'total_amount' => 'required|numeric|min:0',
                'notes' => 'nullable|string',
                'delivery_address' => 'nullable|string',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.unit_price' => 'required|numeric|min:0',
                'items.*.total_price' => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $purchaseOrder = PurchaseOrder::create($request->except('items'));

            // Create purchase order items
            foreach ($request->items as $item) {
                $purchaseOrder->items()->create($item);
            }

            DB::commit();

            $purchaseOrder->load(['supplier', 'items.product']);

            return response()->json([
                'success' => true,
                'data' => $purchaseOrder,
                'message' => 'Purchase order created successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create purchase order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseOrder $purchaseOrder): JsonResponse
    {
        try {
            $purchaseOrder->load(['supplier', 'items.product']);

            return response()->json([
                'success' => true,
                'data' => $purchaseOrder,
                'message' => 'Purchase order retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve purchase order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'supplier_id' => 'sometimes|required|exists:suppliers,id',
                'order_number' => 'sometimes|required|string|max:50|unique:purchase_orders,order_number,' . $purchaseOrder->id,
                'order_date' => 'sometimes|required|date',
                'expected_delivery_date' => 'nullable|date|after_or_equal:order_date',
                'status' => 'sometimes|required|in:draft,pending,confirmed,ordered,received,partial,cancelled',
                'payment_status' => 'sometimes|required|in:pending,partial,paid,overdue',
                'payment_terms' => 'nullable|string|max:100',
                'subtotal' => 'sometimes|required|numeric|min:0',
                'tax_amount' => 'sometimes|required|numeric|min:0',
                'discount_amount' => 'sometimes|required|numeric|min:0',
                'total_amount' => 'sometimes|required|numeric|min:0',
                'notes' => 'nullable|string',
                'delivery_address' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $purchaseOrder->update($request->all());
            $purchaseOrder->load(['supplier', 'items.product']);

            return response()->json([
                'success' => true,
                'data' => $purchaseOrder,
                'message' => 'Purchase order updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update purchase order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseOrder $purchaseOrder): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Delete related items first
            $purchaseOrder->items()->delete();
            
            // Delete the purchase order
            $purchaseOrder->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Purchase order deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete purchase order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get suppliers for dropdown
     */
    public function getSuppliers(): JsonResponse
    {
        try {
            $suppliers = Supplier::select('id', 'name', 'email', 'phone')
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $suppliers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve suppliers',
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
