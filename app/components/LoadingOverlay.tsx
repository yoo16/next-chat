'use client';

import { useLoadingStore } from "@/lib/store/loadingStore";
import Loading from "./Loading";

export default function LoadingOverlay() {
    const isLoading = useLoadingStore(state => state.isLoading);
    return isLoading ? <Loading /> : null;
}
