<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FinanceRecord;
use App\Models\SalesOrder;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FinanceRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $financeRecords = FinanceRecord::with(['salesOrder', 'purchaseOrder'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $financeRecords,
                'message' => 'Finance records retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve finance records',
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
                'sales_order_id' => 'nullable|exists:sales_orders,id',
                'purchase_order_id' => 'nullable|exists:purchase_orders,id',
                'transaction_type' => 'required|in:income,expense,payment,receipt,adjustment',
                'transaction_date' => 'required|date',
                'amount' => 'required|numeric|min:0',
                'currency' => 'required|string|max:3',
                'payment_method' => 'nullable|string|max:50',
                'reference_number' => 'nullable|string|max:100',
                'description' => 'required|string',
                'category' => 'required|string|max:100',
                'status' => 'required|in:pending,completed,failed,cancelled',
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Ensure only one order type is provided
            if ($request->sales_order_id && $request->purchase_order_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot link to both sales order and purchase order',
                ], 422);
            }

            $financeRecord = FinanceRecord::create($request->all());
            $financeRecord->load(['salesOrder', 'purchaseOrder']);

            return response()->json([
                'success' => true,
                'data' => $financeRecord,
                'message' => 'Finance record created successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create finance record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(FinanceRecord $financeRecord): JsonResponse
    {
        try {
            $financeRecord->load(['salesOrder', 'purchaseOrder']);

            return response()->json([
                'success' => true,
                'data' => $financeRecord,
                'message' => 'Finance record retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve finance record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FinanceRecord $financeRecord): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'sales_order_id' => 'nullable|exists:sales_orders,id',
                'purchase_order_id' => 'nullable|exists:purchase_orders,id',
                'transaction_type' => 'sometimes|required|in:income,expense,payment,receipt,adjustment',
                'transaction_date' => 'sometimes|required|date',
                'amount' => 'sometimes|required|numeric|min:0',
                'currency' => 'sometimes|required|string|max:3',
                'payment_method' => 'nullable|string|max:50',
                'reference_number' => 'nullable|string|max:100',
                'description' => 'sometimes|required|string',
                'category' => 'sometimes|required|string|max:100',
                'status' => 'sometimes|required|in:pending,completed,failed,cancelled',
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Ensure only one order type is provided
            if ($request->sales_order_id && $request->purchase_order_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot link to both sales order and purchase order',
                ], 422);
            }

            $financeRecord->update($request->all());
            $financeRecord->load(['salesOrder', 'purchaseOrder']);

            return response()->json([
                'success' => true,
                'data' => $financeRecord,
                'message' => 'Finance record updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update finance record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FinanceRecord $financeRecord): JsonResponse
    {
        try {
            $financeRecord->delete();

            return response()->json([
                'success' => true,
                'message' => 'Finance record deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete finance record',
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
            $salesOrders = SalesOrder::select('id', 'order_number', 'total_amount')
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
     * Get purchase orders for dropdown
     */
    public function getPurchaseOrders(): JsonResponse
    {
        try {
            $purchaseOrders = PurchaseOrder::select('id', 'order_number', 'total_amount')
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
     * Get financial summary
     */
    public function getSummary(): JsonResponse
    {
        try {
            $summary = [
                'total_income' => FinanceRecord::where('transaction_type', 'income')->sum('amount'),
                'total_expenses' => FinanceRecord::where('transaction_type', 'expense')->sum('amount'),
                'total_payments' => FinanceRecord::where('transaction_type', 'payment')->sum('amount'),
                'total_receipts' => FinanceRecord::where('transaction_type', 'receipt')->sum('amount'),
                'net_profit' => FinanceRecord::where('transaction_type', 'income')->sum('amount') - 
                               FinanceRecord::where('transaction_type', 'expense')->sum('amount'),
            ];

            return response()->json([
                'success' => true,
                'data' => $summary
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve financial summary',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
