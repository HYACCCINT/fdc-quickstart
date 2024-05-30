'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getUserById, GetUserByIdResponse, GetUserByIdVariables } from '../../lib/dataconnect-sdk';
import { MdStar } from 'react-icons/md';

const Page = () => {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [user, setUser] = useState<GetUserByIdResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        fetchUserProfile(user.uid);
      } else {
        router.push('/'); // Redirect to home page if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await getUserById({ id: userId });
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-4">Profile: {user.username}</h1>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.reviews.map((review) => (
            <div key={review.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-md p-4">
              <h3 className="font-bold text-lg mb-1 text-white">{review.movie.title}</h3>
              <div className="flex items-center text-yellow-500 mb-2">
                <MdStar className="text-yellow-500" size={20} />
                <span className="ml-1 text-gray-400">{review.rating}</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">{review.reviewDate}</p>
              <p className="text-sm text-gray-300">{review.reviewText}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Watched Movies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.watched.map((watched) => (
            <Link key={watched.movie.id} href={`/movie/${watched.movie.id}`}>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <img className="w-full h-48 object-cover" src={watched.movie.imageUrl} alt={watched.movie.title} />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 text-white">{watched.movie.title}</h3>
                  <p className="text-sm text-gray-400">{watched.movie.genre}</p>
                  <p className="text-sm text-gray-300">{watched.movie.description}</p>
                  <div className="flex items-center text-yellow-500 mt-2">
                    <MdStar className="text-yellow-500" size={20} />
                    <span className="ml-1 text-gray-400">{watched.movie.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Favorite Movies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.favoriteMovies.map((fav) => (
            <Link key={fav.movie.id} href={`/movie/${fav.movie.id}`}>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <img className="w-full h-48 object-cover" src={fav.movie.imageUrl} alt={fav.movie.title} />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 text-white">{fav.movie.title}</h3>
                  <p className="text-sm text-gray-400">{fav.movie.genre}</p>
                  <p className="text-sm text-gray-300">{fav.movie.description}</p>
                  <div className="flex items-center text-yellow-500 mt-2">
                    <MdStar className="text-yellow-500" size={20} />
                    <span className="ml-1 text-gray-400">{fav.movie.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Favorite Actors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.favoriteActors.map((favActor) => (
            <Link key={favActor.actor.id} href={`/actor/${favActor.actor.id}`}>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <img className="w-32 h-32 object-cover rounded-full mx-auto mt-4" src={favActor.actor.imageUrl} alt={favActor.actor.name} />
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg mb-1 text-white">{favActor.actor.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
