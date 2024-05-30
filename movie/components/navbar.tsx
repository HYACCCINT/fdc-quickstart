import { useEffect, useState } from 'react';
import { getAuth, signInWithRedirect, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { firebaseapp, onAuthStateChanged } from '../lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { upsertUser } from '../lib/dataconnect-sdk';
import { FaSearch } from 'react-icons/fa';

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(firebaseapp);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const username = user.email.substring(0, user.email.indexOf("@"));
        await upsertUser({ username });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <nav className="bg-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-white text-lg font-bold">
            FriendlyMovies
          </Link>
          <div className="relative group">
            <button className="text-gray-200 hover:text-white">Genres</button>
            <div className="absolute hidden group-hover:block bg-black text-white mt-1 rounded shadow-lg">
              <Link href="/genre/action" className="block px-4 py-2 hover:bg-gray-800">
                Action
              </Link>
              <Link href="/genre/crime" className="block px-4 py-2 hover:bg-gray-800">
                Crime
              </Link>
              <Link href="/genre/drama" className="block px-4 py-2 hover:bg-gray-800">
                Drama
              </Link>
              <Link href="/genre/sci-fi" className="block px-4 py-2 hover:bg-gray-800">
                Sci-Fi
              </Link>
            </div>
          </div>
          <Link href="/vectors" className="text-gray-200 hover:text-white">
            Vertex AI
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/advancedsearch" className="flex items-center text-gray-200 hover:text-white">
            <FaSearch className="mr-2" />
            Advanced Search
          </Link>
          {user ? (
            <>
              <span className="text-gray-200 mr-4">Hello, {user.displayName}</span>
              <button onClick={handleSignOut} className="text-gray-200 hover:text-white">
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={handleSignIn} className="text-gray-200 hover:text-white">
              Sign In with Google
            </button>
          )}
          {user && (
            <Link href="/myprofile" className="ml-4 text-gray-200 hover:text-white">
              My Profile
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
