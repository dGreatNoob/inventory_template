<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'batch_number',
        'manufacturing_date',
        'expiry_date',
        'quantity',
        'cost_price',
        'lot_number',
        'certificate_number',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'manufacturing_date' => 'date',
        'expiry_date' => 'date',
        'quantity' => 'integer',
        'cost_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the product that owns the batch.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the stock movements for the batch.
     */
    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }
}
