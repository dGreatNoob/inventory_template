<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StockIn extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_order_id',
        'batch_id',
        'reference_number',
        'receipt_date',
        'received_by',
        'status',
        'notes',
    ];

    protected $casts = [
        'receipt_date' => 'date',
    ];

    /**
     * Get the purchase order that owns the stock in record.
     */
    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    /**
     * Get the batch that owns the stock in record.
     */
    public function batch(): BelongsTo
    {
        return $this->belongsTo(Batch::class);
    }

    /**
     * Get the items for the stock in record.
     */
    public function items(): HasMany
    {
        return $this->hasMany(StockInItem::class);
    }
}
