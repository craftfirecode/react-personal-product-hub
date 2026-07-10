import { supabase } from "../lib/supabase";

const BASE_URL = 'https://ecoflow.craftfire.de/api';

export const ecoFlowApiService = {
    async getEcoFlowData () {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const response = await fetch(`${BASE_URL}/quota`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                }
            });

            if (!response.ok) {
                throw new Error(`Fehler beim Laden der Daten: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("API Error (getEcoFlowData):", error);
            throw error;
        }
    },
};
