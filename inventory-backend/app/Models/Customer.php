<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'mobile',
        'address',
        'city',
        'province',
        'postal_code',
        'country',
        'customer_type',
        'tin_number',
        'business_name',
        'contact_person',
        'credit_limit',
        'payment_terms',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'credit_limit' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the sales orders for the customer.
     */
    public function salesOrders()
    {
        return $this->hasMany(SalesOrder::class);
    }

    /**
     * Get the finance records for the customer.
     */
    public function financeRecords()
    {
        return $this->hasMany(FinanceRecord::class);
    }
}
