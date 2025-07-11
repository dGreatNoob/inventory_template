<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $activityLogs = ActivityLog::orderBy('created_at', 'desc')
                ->paginate(50);

            return response()->json([
                'success' => true,
                'data' => $activityLogs,
                'message' => 'Activity logs retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve activity logs',
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
                'user_id' => 'nullable|integer',
                'action' => 'required|string|max:100',
                'model_type' => 'nullable|string|max:100',
                'model_id' => 'nullable|integer',
                'description' => 'required|string',
                'ip_address' => 'nullable|ip',
                'user_agent' => 'nullable|string',
                'old_values' => 'nullable|json',
                'new_values' => 'nullable|json',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $activityLog = ActivityLog::create($request->all());

            return response()->json([
                'success' => true,
                'data' => $activityLog,
                'message' => 'Activity log created successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create activity log',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ActivityLog $activityLog): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $activityLog,
                'message' => 'Activity log retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve activity log',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ActivityLog $activityLog): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'nullable|integer',
                'action' => 'sometimes|required|string|max:100',
                'model_type' => 'nullable|string|max:100',
                'model_id' => 'nullable|integer',
                'description' => 'sometimes|required|string',
                'ip_address' => 'nullable|ip',
                'user_agent' => 'nullable|string',
                'old_values' => 'nullable|json',
                'new_values' => 'nullable|json',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $activityLog->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $activityLog,
                'message' => 'Activity log updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update activity log',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ActivityLog $activityLog): JsonResponse
    {
        try {
            $activityLog->delete();

            return response()->json([
                'success' => true,
                'message' => 'Activity log deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete activity log',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get activity logs by user
     */
    public function getByUser(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|integer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $activityLogs = ActivityLog::where('user_id', $request->user_id)
                ->orderBy('created_at', 'desc')
                ->paginate(50);

            return response()->json([
                'success' => true,
                'data' => $activityLogs,
                'message' => 'User activity logs retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user activity logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get activity logs by model
     */
    public function getByModel(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'model_type' => 'required|string',
                'model_id' => 'required|integer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $activityLogs = ActivityLog::where('model_type', $request->model_type)
                ->where('model_id', $request->model_id)
                ->orderBy('created_at', 'desc')
                ->paginate(50);

            return response()->json([
                'success' => true,
                'data' => $activityLogs,
                'message' => 'Model activity logs retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve model activity logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get activity logs by action
     */
    public function getByAction(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'action' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $activityLogs = ActivityLog::where('action', $request->action)
                ->orderBy('created_at', 'desc')
                ->paginate(50);

            return response()->json([
                'success' => true,
                'data' => $activityLogs,
                'message' => 'Action activity logs retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve action activity logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear old activity logs
     */
    public function clearOldLogs(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'days' => 'required|integer|min:1|max:365',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $deletedCount = ActivityLog::where('created_at', '<', now()->subDays($request->days))->delete();

            return response()->json([
                'success' => true,
                'message' => "Deleted {$deletedCount} old activity logs",
                'deleted_count' => $deletedCount
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear old activity logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
