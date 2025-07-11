<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Test route to verify API routes are loading
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

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

