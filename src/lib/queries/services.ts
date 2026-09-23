import "server-only";

import { unstable_cache } from "next/cache";
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

async function queryServices(): Promise<Service[]> {
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

export const getServices = unstable_cache(
  queryServices,
  ["public-services-v2"],
  { revalidate: 900, tags: ["services"] },
);

export async function getServiceBySlug(slug: string) {
  const services = await getServices();
  return services.find((service) => service.slug === slug) ?? null;
}
