<?php

namespace App\Http\Controllers;

use App\Models\FavoriteSource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteSourceController extends Controller
{
    public function destroy(Request $request)
    {
        try {
            $sourceId = $request->input('source_id');
            
            // Find the favorite source
            $favoriteSource = FavoriteSource::where('id', $sourceId)
                ->where('user_id', Auth::id())
                ->first();
            
            if (!$favoriteSource) {
                return response()->json([
                    'message' => 'Favorite source not found'
                ], 404);
            }
            
            // Delete the favorite source
            $favoriteSource->delete();
            
            return response()->json([
                'message' => 'Favorite source deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete favorite source',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}