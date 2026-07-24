<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserManagementController extends Controller
{
    public function index()
    {
        $users = User::query()
            ->withCount(['exercises', 'categories', 'favouriteExercises'])
            ->orderBy('id')
            ->get();

        return view('admin.users.index', [
            'users' => $users,
        ]);
    }

    public function edit(User $user)
    {
        return view('admin.users.edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', Rule::in(['admin', 'user'])],
            'birth_date' => ['required', 'date', 'before_or_equal:today'],
        ]);

        $makeAdmin = $validated['role'] === 'admin';

        if ($request->user()->id === $user->id && ! $makeAdmin) {
            return back()
                ->withErrors(['role' => 'You cannot remove your own admin access.'])
                ->withInput();
        }

        $user->update([
            'name' => $validated['name'],
            'is_admin' => $makeAdmin,
            'birth_date' => $validated['birth_date'],
        ]);

        return redirect()
            ->route('admin.users.index')
            ->with('status', 'User updated.');
    }

    public function destroy(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return back()->withErrors(['user' => 'You cannot delete your own account from admin panel.']);
        }

        $user->delete();

        return redirect()
            ->route('admin.users.index')
            ->with('status', 'User deleted.');
    }
}
