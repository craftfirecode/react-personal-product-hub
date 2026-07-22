import { useRef } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
    useQueries,
} from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    ImagePlus,
    Trash2,
    Loader2,
} from "lucide-react";

// ---------------------------------------------
// Types
// ---------------------------------------------

type Image = {
    id: string;
    user_id: string;
    file_path: string;
    created_at: string;
};

// ---------------------------------------------
// API
// ---------------------------------------------

const SIGNED_URL_EXPIRY = 3600; // 1 Stunde

const imagesAPI = {
    async fetchImages(): Promise<Image[]> {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("Nicht eingeloggt");

        const { data, error } = await supabase
            .from("images")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", {
                ascending: false,
            });

        if (error) throw error;

        return data ?? [];
    },

    async uploadImage(file: File): Promise<Image> {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("Nicht eingeloggt");

        if (!file.type.startsWith("image/")) {
            throw new Error("Bitte nur Bilder hochladen.");
        }

        if (file.size > 5 * 1024 * 1024) {
            throw new Error("Das Bild darf maximal 5 MB groß sein.");
        }

        const extension =
            file.name.split(".").pop()?.toLowerCase() ?? "jpg";

        const fileName = `${crypto.randomUUID()}.${extension}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("images")
            .upload(filePath, file, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) throw uploadError;

        const { data, error: databaseError } = await supabase
            .from("images")
            .insert({
                user_id: user.id,
                file_path: filePath,
            })
            .select()
            .single();

        if (databaseError) {
            await supabase.storage
                .from("images")
                .remove([filePath]);

            throw databaseError;
        }

        return data;
    },

    async deleteImage(image: Image): Promise<void> {
        const { error: storageError } = await supabase.storage
            .from("images")
            .remove([image.file_path]);

        if (storageError) throw storageError;

        const { error: databaseError } = await supabase
            .from("images")
            .delete()
            .eq("id", image.id)
            .eq("user_id", image.user_id);

        if (databaseError) throw databaseError;
    },

    async getSignedUrl(filePath: string): Promise<string> {
        const { data, error } = await supabase.storage
            .from("images")
            .createSignedUrl(filePath, SIGNED_URL_EXPIRY);

        if (error) throw error;

        return data.signedUrl;
    },
};

// ---------------------------------------------
// Hooks
// ---------------------------------------------

function useImages() {
    return useQuery<Image[]>({
        queryKey: ["images"],
        queryFn: imagesAPI.fetchImages,
    });
}

function useUploadImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: imagesAPI.uploadImage,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["images"],
            });
        },
    });
}

function useDeleteImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: imagesAPI.deleteImage,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["images"],
            });
        },
    });
}

// Signed URLs für alle Bilder parallel laden
function useSignedUrls(images: Image[] | undefined) {
    return useQueries({
        queries: (images ?? []).map((image) => ({
            queryKey: ["signed-url", image.file_path],
            queryFn: () => imagesAPI.getSignedUrl(image.file_path),
            staleTime: (SIGNED_URL_EXPIRY - 60) * 1000, // kurz vor Ablauf neu holen
            enabled: !!image.file_path,
        })),
    });
}

// ---------------------------------------------
// Component
// ---------------------------------------------

export default function ImageManager() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        data: images,
        isLoading,
        error,
    } = useImages();

    const uploadImageMutation = useUploadImage();
    const deleteImageMutation = useDeleteImage();

    const signedUrlQueries = useSignedUrls(images);

    const handleSelectFile = () => {
        fileInputRef.current?.click();
    };

    const handleUpload = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        uploadImageMutation.mutate(file);

        event.target.value = "";
    };

    const handleDelete = (image: Image) => {
        const confirmed = window.confirm(
            "Möchtest du dieses Bild wirklich löschen?"
        );

        if (!confirmed) return;

        deleteImageMutation.mutate(image);
    };

    return (
        <Card className="mx-auto mt-10 max-w-3xl">
            <CardHeader>
                <CardTitle>Bilder</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleUpload}
                    className="hidden"
                />

                <Button
                    onClick={handleSelectFile}
                    disabled={uploadImageMutation.isPending}
                >
                    {uploadImageMutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Hochladen...
                        </>
                    ) : (
                        <>
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Bild auswählen
                        </>
                    )}
                </Button>

                {uploadImageMutation.isError && (
                    <p className="text-sm text-red-500">
                        Upload-Fehler:{" "}
                        {(uploadImageMutation.error as Error).message}
                    </p>
                )}

                {deleteImageMutation.isError && (
                    <p className="text-sm text-red-500">
                        Löschfehler:{" "}
                        {(deleteImageMutation.error as Error).message}
                    </p>
                )}

                {isLoading && <p>Bilder werden geladen...</p>}

                {error && (
                    <p className="text-sm text-red-500">
                        Fehler: {(error as Error).message}
                    </p>
                )}

                {!isLoading && images?.length === 0 && (
                    <p className="text-muted-foreground">
                        Noch keine Bilder vorhanden.
                    </p>
                )}

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {images?.map((image, index) => {
                        const signedUrlQuery = signedUrlQueries[index];

                        return (
                            <div
                                key={image.id}
                                className="overflow-hidden rounded-lg border"
                            >
                                {signedUrlQuery?.isLoading && (
                                    <div className="flex h-40 w-full items-center justify-center bg-muted">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                )}

                                {signedUrlQuery?.isError && (
                                    <div className="flex h-40 w-full items-center justify-center bg-muted">
                                        <p className="text-xs text-red-500">
                                            Fehler beim Laden
                                        </p>
                                    </div>
                                )}

                                {signedUrlQuery?.data && (
                                    <img
                                        src={signedUrlQuery.data}
                                        alt="Hochgeladenes Bild"
                                        className="h-40 w-full object-cover"
                                    />
                                )}

                                <div className="p-2">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="w-full"
                                        onClick={() =>
                                            handleDelete(image)
                                        }
                                        disabled={
                                            deleteImageMutation.isPending
                                        }
                                    >
                                        {deleteImageMutation.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Löschen
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}