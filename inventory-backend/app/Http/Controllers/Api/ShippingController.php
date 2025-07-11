<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shipping;
use App\Models\SalesOrder;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ShippingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $shippings = Shipping::with(['salesOrder', 'customer'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $shippings,
                'message' => 'Shipping records retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve shipping records',
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
                'sales_order_id' => 'required|exists:sales_orders,id',
                'customer_id' => 'required|exists:customers,id',
                'tracking_number' => 'required|string|max:100|unique:shippings',
                'shipping_date' => 'required|date',
                'expected_delivery_date' => 'nullable|date|after_or_equal:shipping_date',
                'status' => 'required|in:pending,shipped,in_transit,delivered,failed,returned',
                'shipping_method' => 'required|string|max:50',
                'shipping_cost' => 'required|numeric|min:0',
                'carrier' => 'required|string|max:100',
                'shipping_address' => 'required|string',
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $shipping = Shipping::create($request->all());
            $shipping->load(['salesOrder', 'customer']);

            return response()->json([
                'success' => true,
                'data' => $shipping,
                'message' => 'Shipping record created successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create shipping record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Shipping $shipping): JsonResponse
    {
        try {
            $shipping->load(['salesOrder', 'customer']);

            return response()->json([
                'success' => true,
                'data' => $shipping,
                'message' => 'Shipping record retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve shipping record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Shipping $shipping): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'sales_order_id' => 'sometimes|required|exists:sales_orders,id',
                'customer_id' => 'sometimes|required|exists:customers,id',
                'tracking_number' => 'sometimes|required|string|max:100|unique:shippings,tracking_number,' . $shipping->id,
                'shipping_date' => 'sometimes|required|date',
                'expected_delivery_date' => 'nullable|date|after_or_equal:shipping_date',
                'status' => 'sometimes|required|in:pending,shipped,in_transit,delivered,failed,returned',
                'shipping_method' => 'sometimes|required|string|max:50',
                'shipping_cost' => 'sometimes|required|numeric|min:0',
                'carrier' => 'sometimes|required|string|max:100',
                'shipping_address' => 'sometimes|required|string',
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $shipping->update($request->all());
            $shipping->load(['salesOrder', 'customer']);

            return response()->json([
                'success' => true,
                'data' => $shipping,
                'message' => 'Shipping record updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update shipping record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shipping $shipping): JsonResponse
    {
        try {
            $shipping->delete();

            return response()->json([
                'success' => true,
                'message' => 'Shipping record deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete shipping record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sales orders for dropdown
     */
    public function getSalesOrders(): JsonResponse
    {
        try {
            $salesOrders = SalesOrder::select('id', 'order_number', 'customer_id')
                ->with('customer:id,name')
                ->where('status', '!=', 'cancelled')
                ->orderBy('order_date', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $salesOrders
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
}
