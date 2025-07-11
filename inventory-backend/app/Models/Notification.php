<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'read_at',
        'priority',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'data' => 'array',
        'read_at' => 'datetime',
    ];
}
