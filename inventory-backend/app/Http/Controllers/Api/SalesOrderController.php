<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalesOrder;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SalesOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $salesOrders = SalesOrder::with(['customer', 'items.product'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $salesOrders,
                'message' => 'Sales orders retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve sales orders',
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
                'customer_id' => 'required|exists:customers,id',
                'order_number' => 'required|string|max:50|unique:sales_orders',
                'order_date' => 'required|date',
                'delivery_date' => 'nullable|date|after_or_equal:order_date',
                'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled',
                'payment_status' => 'required|in:pending,partial,paid,overdue',
                'payment_method' => 'nullable|string|max:50',
                'subtotal' => 'required|numeric|min:0',
                'tax_amount' => 'required|numeric|min:0',
                'discount_amount' => 'required|numeric|min:0',
                'total_amount' => 'required|numeric|min:0',
                'notes' => 'nullable|string',
                'shipping_address' => 'nullable|string',
                'billing_address' => 'nullable|string',
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

            $salesOrder = SalesOrder::create($request->except('items'));

            // Create sales order items
            foreach ($request->items as $item) {
                $salesOrder->items()->create($item);
            }

            DB::commit();

            $salesOrder->load(['customer', 'items.product']);

            return response()->json([
                'success' => true,
                'data' => $salesOrder,
                'message' => 'Sales order created successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create sales order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(SalesOrder $salesOrder): JsonResponse
    {
        try {
            $salesOrder->load(['customer', 'items.product']);

            return response()->json([
                'success' => true,
                'data' => $salesOrder,
                'message' => 'Sales order retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve sales order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SalesOrder $salesOrder): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'customer_id' => 'sometimes|required|exists:customers,id',
                'order_number' => 'sometimes|required|string|max:50|unique:sales_orders,order_number,' . $salesOrder->id,
                'order_date' => 'sometimes|required|date',
                'delivery_date' => 'nullable|date|after_or_equal:order_date',
                'status' => 'sometimes|required|in:pending,confirmed,processing,shipped,delivered,cancelled',
                'payment_status' => 'sometimes|required|in:pending,partial,paid,overdue',
                'payment_method' => 'nullable|string|max:50',
                'subtotal' => 'sometimes|required|numeric|min:0',
                'tax_amount' => 'sometimes|required|numeric|min:0',
                'discount_amount' => 'sometimes|required|numeric|min:0',
                'total_amount' => 'sometimes|required|numeric|min:0',
                'notes' => 'nullable|string',
                'shipping_address' => 'nullable|string',
                'billing_address' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $salesOrder->update($request->all());
            $salesOrder->load(['customer', 'items.product']);

            return response()->json([
                'success' => true,
                'data' => $salesOrder,
                'message' => 'Sales order updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update sales order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SalesOrder $salesOrder): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Delete related items first
            $salesOrder->items()->delete();
            
            // Delete the sales order
            $salesOrder->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Sales order deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete sales order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get customers for dropdown
     */
    public function getCustomers(): JsonResponse
    {
        try {
            $customers = Customer::select('id', 'name', 'email', 'phone')
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $customers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve customers',
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
            $products = Product::select('id', 'name', 'sku', 'current_stock', 'selling_price')
                ->where('current_stock', '>', 0)
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
