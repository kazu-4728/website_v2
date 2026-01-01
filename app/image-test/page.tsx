import { fetchRandomOnsenImage, fetchRandomOnsenImagePixabay, fetchRandomOnsenImagePexels } from '../lib/images';
import { CardContent } from '../components/modern/ui/CardContent';

export default async function ImageTestPage() {
    // Fetch from all providers in parallel
    const [unsplashImage, pixabayImage, pexelsImage] = await Promise.all([
        fetchRandomOnsenImage(),
        fetchRandomOnsenImagePixabay(),
        fetchRandomOnsenImagePexels()
    ]);

    return (
        <div className="min-h-screen bg-gray-950 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl text-white font-bold mb-8">Multi-Provider Image Fetch Test</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Unsplash Section */}
                    <section className="space-y-4">
                        <h2 className="text-xl text-gray-300 font-bold border-b border-gray-700 pb-2">Unsplash</h2>
                        {unsplashImage ? (
                            <div className="h-80 relative">
                                <CardContent
                                    title="Unsplash"
                                    description={unsplashImage.description ? unsplashImage.description.substring(0, 100) + '...' : 'No description'}
                                    learnMoreText="View Source"
                                    image={unsplashImage.url}
                                    className="h-full"
                                />
                            </div>
                        ) : (
                            <div className="p-4 bg-red-900/20 text-red-200 border border-red-900 rounded h-80 flex items-center justify-center">
                                <p className="text-center">Failed to fetch.<br />Check UNSPLASH_ACCESS_KEY</p>
                            </div>
                        )}
                        <div className="text-xs text-gray-500 font-mono bg-black/50 p-2 rounded overflow-hidden truncate">
                            ID: {unsplashImage?.sourceUrl || 'N/A'}
                        </div>
                    </section>

                    {/* Pixabay Section */}
                    <section className="space-y-4">
                        <h2 className="text-xl text-gray-300 font-bold border-b border-gray-700 pb-2">Pixabay</h2>
                        {pixabayImage ? (
                            <div className="h-80 relative">
                                <CardContent
                                    title="Pixabay"
                                    description={pixabayImage.description ? pixabayImage.description.substring(0, 100) + '...' : 'No description'}
                                    learnMoreText="View Source"
                                    image={pixabayImage.url}
                                    className="h-full"
                                />
                            </div>
                        ) : (
                            <div className="p-4 bg-red-900/20 text-red-200 border border-red-900 rounded h-80 flex items-center justify-center">
                                <p className="text-center">Failed to fetch.<br />Check PIXABAY_API_KEY</p>
                            </div>
                        )}
                        <div className="text-xs text-gray-500 font-mono bg-black/50 p-2 rounded overflow-hidden truncate">
                            Source: {pixabayImage?.sourceUrl || 'N/A'}
                        </div>
                    </section>

                    {/* Pexels Section */}
                    <section className="space-y-4">
                        <h2 className="text-xl text-gray-300 font-bold border-b border-gray-700 pb-2">Pexels</h2>
                        {pexelsImage ? (
                            <div className="h-80 relative">
                                <CardContent
                                    title="Pexels"
                                    description={pexelsImage.description ? pexelsImage.description.substring(0, 100) + '...' : 'No description'}
                                    learnMoreText="View Source"
                                    image={pexelsImage.url}
                                    className="h-full"
                                />
                            </div>
                        ) : (
                            <div className="p-4 bg-red-900/20 text-red-200 border border-red-900 rounded h-80 flex items-center justify-center">
                                <p className="text-center">Failed to fetch.<br />Check PEXELS_API_KEY</p>
                            </div>
                        )}
                        <div className="text-xs text-gray-500 font-mono bg-black/50 p-2 rounded overflow-hidden truncate">
                            Source: {pexelsImage?.sourceUrl || 'N/A'}
                        </div>
                    </section>
                </div>

                <div className="mt-12 text-gray-400 font-mono text-sm bg-black/50 p-4 rounded overflow-auto max-h-64">
                    <p className="mb-2 font-bold sticky top-0 bg-black/80 p-1">Full Debug Metadata:</p>
                    <pre>{JSON.stringify({ unsplash: unsplashImage, pixabay: pixabayImage, pexels: pexelsImage }, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
}
