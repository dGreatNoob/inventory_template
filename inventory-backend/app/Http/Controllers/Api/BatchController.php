<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class BatchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $batches = Batch::with('product')->get();
            return response()->json([
                'success' => true,
                'data' => $batches,
                'message' => 'Batches retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving batches: ' . $e->getMessage()
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
                'product_id' => 'required|exists:products,id',
                'batch_number' => 'required|string|unique:batches,batch_number|max:255',
                'manufacturing_date' => 'nullable|date',
                'expiry_date' => 'nullable|date|after:manufacturing_date',
                'quantity' => 'required|integer|min:1',
                'cost_price' => 'required|numeric|min:0',
                'lot_number' => 'nullable|string|max:255',
                'certificate_number' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $batch = Batch::create($request->all());
            $batch->load('product');

            return response()->json([
                'success' => true,
                'data' => $batch,
                'message' => 'Batch created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating batch: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Batch $batch): JsonResponse
    {
        try {
            $batch->load('product');
            return response()->json([
                'success' => true,
                'data' => $batch,
                'message' => 'Batch retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving batch: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Batch $batch): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'product_id' => 'sometimes|required|exists:products,id',
                'batch_number' => 'sometimes|required|string|max:255|unique:batches,batch_number,' . $batch->id,
                'manufacturing_date' => 'nullable|date',
                'expiry_date' => 'nullable|date|after:manufacturing_date',
                'quantity' => 'sometimes|required|integer|min:1',
                'cost_price' => 'sometimes|required|numeric|min:0',
                'lot_number' => 'nullable|string|max:255',
                'certificate_number' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $batch->update($request->all());
            $batch->load('product');

            return response()->json([
                'success' => true,
                'data' => $batch,
                'message' => 'Batch updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating batch: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Batch $batch): JsonResponse
    {
        try {
            $batch->delete();
            return response()->json([
                'success' => true,
                'message' => 'Batch deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting batch: ' . $e->getMessage()
            ], 500);
        }
    }
}
