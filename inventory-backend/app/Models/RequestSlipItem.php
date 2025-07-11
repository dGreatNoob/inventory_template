<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequestSlipItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_slip_id',
        'product_id',
        'quantity',
        'purpose',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    /**
     * Get the request slip that owns the item.
     */
    public function requestSlip(): BelongsTo
    {
        return $this->belongsTo(RequestSlip::class);
    }

    /**
     * Get the product for the item.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
} 