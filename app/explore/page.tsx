"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ExplorePage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/explore");
        if (res.ok) {
          const data = await res.json();
          setItems(data || []);
        }
      } catch (err) {
        console.error("Failed to load explore items", err);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Explore</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="w-full h-48 bg-zinc-100 dark:bg-zinc-900 relative">
                <img
                  src={item.thumbnail || '/file.svg'}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="p-3">
                <div className="text-sm font-semibold text-zinc-900 dark:text-white">{item.title}</div>
                <div className="text-xs text-zinc-500 mt-1">{item.user?.name || 'Unknown'}</div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-zinc-600">0 reactions</div>
                  <Button variant="ghost" size="sm" onClick={() => alert('Like not implemented yet')}>Like</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
