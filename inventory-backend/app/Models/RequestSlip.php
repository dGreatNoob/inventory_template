<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RequestSlip extends Model
{
    use HasFactory;

    protected $fillable = [
        'slip_number',
        'request_date',
        'requested_by',
        'department',
        'purpose',
        'status',
        'approved_by',
        'approved_date',
        'notes',
    ];

    protected $casts = [
        'request_date' => 'date',
        'approved_date' => 'date',
    ];

    /**
     * Get the items for the request slip.
     */
    public function items(): HasMany
    {
        return $this->hasMany(RequestSlipItem::class);
    }
}
