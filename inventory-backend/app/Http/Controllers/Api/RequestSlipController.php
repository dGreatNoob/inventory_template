<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RequestSlip;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RequestSlipController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $requestSlips = RequestSlip::with(['items.product'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $requestSlips,
                'message' => 'Request slips retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve request slips',
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
                'slip_number' => 'required|string|max:50|unique:request_slips',
                'request_date' => 'required|date',
                'requested_by' => 'required|string|max:100',
                'department' => 'required|string|max:100',
                'purpose' => 'required|string',
                'status' => 'required|in:pending,approved,rejected,issued',
                'approved_by' => 'nullable|string|max:100',
                'approved_date' => 'nullable|date|after_or_equal:request_date',
                'notes' => 'nullable|string',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.purpose' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $requestSlip = RequestSlip::create($request->except('items'));

            // Create request slip items
            foreach ($request->items as $item) {
                $requestSlip->items()->create($item);
            }

            DB::commit();

            $requestSlip->load(['items.product']);

            return response()->json([
                'success' => true,
                'data' => $requestSlip,
                'message' => 'Request slip created successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create request slip',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(RequestSlip $requestSlip): JsonResponse
    {
        try {
            $requestSlip->load(['items.product']);

            return response()->json([
                'success' => true,
                'data' => $requestSlip,
                'message' => 'Request slip retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve request slip',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RequestSlip $requestSlip): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'slip_number' => 'sometimes|required|string|max:50|unique:request_slips,slip_number,' . $requestSlip->id,
                'request_date' => 'sometimes|required|date',
                'requested_by' => 'sometimes|required|string|max:100',
                'department' => 'sometimes|required|string|max:100',
                'purpose' => 'sometimes|required|string',
                'status' => 'sometimes|required|in:pending,approved,rejected,issued',
                'approved_by' => 'nullable|string|max:100',
                'approved_date' => 'nullable|date|after_or_equal:request_date',
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $requestSlip->update($request->all());
            $requestSlip->load(['items.product']);

            return response()->json([
                'success' => true,
                'data' => $requestSlip,
                'message' => 'Request slip updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update request slip',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RequestSlip $requestSlip): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Delete related items first
            $requestSlip->items()->delete();
            
            // Delete the request slip
            $requestSlip->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Request slip deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete request slip',
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
            $products = Product::select('id', 'name', 'sku', 'current_stock')
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
