<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/tes', function (Request $request) {
  return response()->json(['message' => 'tes berhasil']);
});
