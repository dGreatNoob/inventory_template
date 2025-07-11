<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Shipping extends Model
{
    use HasFactory;

    protected $fillable = [
        'sales_order_id',
        'customer_id',
        'tracking_number',
        'shipping_date',
        'expected_delivery_date',
        'status',
        'shipping_method',
        'shipping_cost',
        'carrier',
        'shipping_address',
        'notes',
    ];

    protected $casts = [
        'shipping_date' => 'date',
        'expected_delivery_date' => 'date',
        'shipping_cost' => 'decimal:2',
    ];

    /**
     * Get the sales order that owns the shipping record.
     */
    public function salesOrder(): BelongsTo
    {
        return $this->belongsTo(SalesOrder::class);
    }

    /**
     * Get the customer that owns the shipping record.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
