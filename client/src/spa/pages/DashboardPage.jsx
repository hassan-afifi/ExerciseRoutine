import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api';

export function DashboardPage() {
    const dashboardQuery = useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const response = await api.get('/dashboard');
            return response.data;
        },
    });

    if (dashboardQuery.isLoading) {
        return <div className="max-w-6xl mx-auto p-8">Loading dashboard...</div>;
    }

    const data = dashboardQuery.data ?? {
        all_exercises_count: 0,
        my_exercises_count: 0,
        favourites_count: 0,
        my_categories_count: 0,
    };

    return (
        <section className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
            <header>
                <h1 className="text-3xl font-bold">Dashboard</h1>
            </header>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="All Exercises" value={data.all_exercises_count} />
                <StatCard title="My Exercises" value={data.my_exercises_count} />
                <StatCard title="Favourites" value={data.favourites_count} />
                <StatCard title="My Categories" value={data.my_categories_count} />
            </div>
            <div className="flex flex-wrap gap-2">
                <Link to="/exercises/my" className="btn btn-primary">My Exercises</Link>
                <Link to="/favourites" className="btn btn-outline btn-primary">Favourites</Link>
                <Link to="/categories" className="btn btn-outline btn-primary">My Categories</Link>
            </div>
        </section>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="card bg-base-100 border border-base-300 shadow-md">
            <div className="card-body">
                <p className="text-sm text-base-content/75">{title}</p>
                <p className="text-3xl font-bold">{value}</p>
            </div>
        </div>
    );
}
