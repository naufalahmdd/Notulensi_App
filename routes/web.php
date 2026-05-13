<?php

use App\Http\Controllers\MeetingController;
use App\Http\Controllers\MeetingFindingController;
use App\Http\Controllers\AttendanceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/absen/{meeting}', [AttendanceController::class, 'create'])->name('attendances.create');
Route::post('/absen/{meeting}', [AttendanceController::class, 'store'])->name('attendances.store');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('meetings', MeetingController::class);
    Route::get('/meetings/{meeting}/minutes', [MeetingController::class, 'minutes'])->name('meetings.minutes');
    Route::post('/meetings/{meeting}/minutes', [MeetingController::class, 'saveMinutes'])->name('meetings.minutes.save');
    Route::get('/meetings/{meeting}/export', [MeetingController::class, 'exportWord'])->name('meetings.export');
    Route::resource('meetings.findings', MeetingFindingController::class)->shallow()->except(['index', 'show', 'create', 'edit']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
