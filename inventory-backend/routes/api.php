<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

// Public login route
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    $token = $user->createToken('spa-token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type' => 'Bearer',
        'user' => $user,
    ]);
});

// Public registration route (optional)
// Route::post('/register', ...);

// Protected route to get current user
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Logout route
Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out']);
});

// Example: Protect other routes
// Route::middleware('auth:sanctum')->get('/products', ...);

// API Resource Routes
Route::apiResource('products', App\Http\Controllers\Api\ProductController::class);
Route::apiResource('categories', App\Http\Controllers\Api\CategoryController::class);
Route::apiResource('batches', App\Http\Controllers\Api\BatchController::class);
Route::apiResource('suppliers', App\Http\Controllers\Api\SupplierController::class);
Route::apiResource('customers', App\Http\Controllers\Api\CustomerController::class);
Route::apiResource('sales-orders', App\Http\Controllers\Api\SalesOrderController::class);
Route::apiResource('purchase-orders', App\Http\Controllers\Api\PurchaseOrderController::class);
Route::apiResource('stock-ins', App\Http\Controllers\Api\StockInController::class);
Route::apiResource('shippings', App\Http\Controllers\Api\ShippingController::class);
Route::apiResource('request-slips', App\Http\Controllers\Api\RequestSlipController::class);
Route::apiResource('finance-records', App\Http\Controllers\Api\FinanceRecordController::class);
Route::apiResource('activity-logs', App\Http\Controllers\Api\ActivityLogController::class);
Route::apiResource('notifications', App\Http\Controllers\Api\NotificationController::class); 

