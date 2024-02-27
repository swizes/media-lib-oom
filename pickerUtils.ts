import {
    Album,
    AssetsOptions,
    getAlbumsAsync,
    getAssetsAsync,
    SortBy,
} from 'expo-media-library';
import { orderBy } from 'lodash';

//1. getAlbumPickerItems is getting called
//2. generateListOfAlbumsWithThumbnail is getting called
//3. getAlbumThumbnail is getting called an OOM happens

export const getAlbumThumbnail = async (
    album: Album,
    mediaType: AssetsOptions['mediaType'],
) => {
    try {
        const albumAssets = await getAssetsAsync({
            first: 1,
            album: album.id,
            mediaType,
            sortBy: SortBy.creationTime,
        });

        return albumAssets?.assets[0]?.uri || '';
    } catch (error) {
        throw error;
    }
};

export const generateListOfAlbumsWithThumbnail = async (
    mediaType: AssetsOptions['mediaType'],
): Promise<any[]> => {
    try {
        const albums = await getAlbumsAsync({ includeSmartAlbums: true });

        const albumsWithAtLeastOneAsset = albums.filter(
            album => album.assetCount > 0,
        );

        const result = [];

        for (const album of albumsWithAtLeastOneAsset) {
            const albumData = {
                id: album.id,
                title: album.title,
                count: album.assetCount,
                image: await getAlbumThumbnail(album, mediaType),
            };
            result.push(albumData);
        }
        return result;
    } catch (error) {
        throw error;
    }
};

export const getAlbumPickerItems = async (
    mediaType: AssetsOptions['mediaType'],
): Promise<any[]> => {
    try {
        const albumsWithThumbnail = await generateListOfAlbumsWithThumbnail(
            mediaType,
        );

        return orderBy(
            albumsWithThumbnail,
            [album => album.title.toLowerCase()],
            'asc',
        );
    } catch {
        return [];
    }
};
