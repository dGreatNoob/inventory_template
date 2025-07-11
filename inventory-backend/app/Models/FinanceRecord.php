<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FinanceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'sales_order_id',
        'purchase_order_id',
        'transaction_type',
        'transaction_date',
        'amount',
        'currency',
        'payment_method',
        'reference_number',
        'description',
        'category',
        'status',
        'notes',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'amount' => 'decimal:2',
    ];

    /**
     * Get the sales order that owns the finance record.
     */
    public function salesOrder(): BelongsTo
    {
        return $this->belongsTo(SalesOrder::class);
    }

    /**
     * Get the purchase order that owns the finance record.
     */
    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class);
    }
}
