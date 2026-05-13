import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { env } from "@/config/env";
import { mockServices } from "@/lib/seed-data";
import type { Database, Service } from "@/lib/types";

function hasSupabaseConfig() {
  return Boolean(env.supabaseUrl?.trim() && env.supabaseAnonKey?.trim());
}

function createPublicClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  return createSupabaseClient<Database>(
    env.supabaseUrl,
    env.supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

export async function getServices(): Promise<Service[]> {
  const supabase = createPublicClient();

  if (!supabase) {
    return mockServices;
  }

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data || data.length === 0) {
    return mockServices;
  }

  return data;
}

export async function getServiceBySlug(slug: string) {
  const services = await getServices();
  return services.find((service) => service.slug === slug) ?? null;
}
