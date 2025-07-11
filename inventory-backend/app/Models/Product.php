<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sku',
        'barcode',
        'description',
        'category_id',
        'cost_price',
        'selling_price',
        'reorder_level',
        'current_stock',
        'unit',
        'brand',
        'model',
        'specifications',
        'supplier_code',
        'image_path',
        'is_active',
    ];

    protected $casts = [
        'cost_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'reorder_level' => 'integer',
        'current_stock' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the category that owns the product.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the batches for the product.
     */
    public function batches()
    {
        return $this->hasMany(Batch::class);
    }
}
