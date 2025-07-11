<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $notifications = Notification::orderBy('created_at', 'desc')
                ->paginate(50);

            return response()->json([
                'success' => true,
                'data' => $notifications,
                'message' => 'Notifications retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve notifications',
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
                'type' => 'required|string|max:50',
                'title' => 'required|string|max:255',
                'message' => 'required|string',
                'data' => 'nullable|json',
                'read_at' => 'nullable|date',
                'priority' => 'required|in:low,normal,high,urgent',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $notification = Notification::create($request->all());

            return response()->json([
                'success' => true,
                'data' => $notification,
                'message' => 'Notification created successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Notification $notification): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $notification,
                'message' => 'Notification retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Notification $notification): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'nullable|integer',
                'type' => 'sometimes|required|string|max:50',
                'title' => 'sometimes|required|string|max:255',
                'message' => 'sometimes|required|string',
                'data' => 'nullable|json',
                'read_at' => 'nullable|date',
                'priority' => 'sometimes|required|in:low,normal,high,urgent',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $notification->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $notification,
                'message' => 'Notification updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Notification $notification): JsonResponse
    {
        try {
            $notification->delete();

            return response()->json([
                'success' => true,
                'message' => 'Notification deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get notifications by user
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

            $notifications = Notification::where('user_id', $request->user_id)
                ->orderBy('created_at', 'desc')
                ->paginate(50);

            return response()->json([
                'success' => true,
                'data' => $notifications,
                'message' => 'User notifications retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user notifications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get unread notifications
     */
    public function getUnread(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'nullable|integer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $query = Notification::whereNull('read_at');
            
            if ($request->user_id) {
                $query->where('user_id', $request->user_id);
            }

            $notifications = $query->orderBy('created_at', 'desc')
                ->paginate(50);

            return response()->json([
                'success' => true,
                'data' => $notifications,
                'message' => 'Unread notifications retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve unread notifications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Notification $notification): JsonResponse
    {
        try {
            $notification->update(['read_at' => now()]);

            return response()->json([
                'success' => true,
                'data' => $notification,
                'message' => 'Notification marked as read'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark notification as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'nullable|integer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $query = Notification::whereNull('read_at');
            
            if ($request->user_id) {
                $query->where('user_id', $request->user_id);
            }

            $updatedCount = $query->update(['read_at' => now()]);

            return response()->json([
                'success' => true,
                'message' => "Marked {$updatedCount} notifications as read",
                'updated_count' => $updatedCount
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark notifications as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get notification count
     */
    public function getCount(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'nullable|integer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $query = Notification::query();
            
            if ($request->user_id) {
                $query->where('user_id', $request->user_id);
            }

            $counts = [
                'total' => $query->count(),
                'unread' => $query->whereNull('read_at')->count(),
                'read' => $query->whereNotNull('read_at')->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $counts,
                'message' => 'Notification counts retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve notification counts',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
