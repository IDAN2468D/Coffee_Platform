'use server';

import { BrewRecipeSyncSchema, BrewRecipeSync, SyncResponse } from '@/lib/schemas/notebookSchema';

export async function syncBrewRecipeToWorkspace(data: BrewRecipeSync): Promise<SyncResponse> {
  try {
    const validated = BrewRecipeSyncSchema.parse(data);

    // Formatted simulation for NotebookLM & Google Workspace API export
    const simulatedDocId = `doc_${Date.now().toString(36)}`;
    const formattedRecipe = `
📌 [מתכון קפה מוגן - NotebookLM Sync]
כותרת: ${validated.recipeTitle}
שיטה: ${validated.method}
יחס חליטה: ${validated.coffeeGrams}g קפה / ${validated.waterGrams}ml מים (1:${(validated.waterGrams / validated.coffeeGrams).toFixed(1)})
טמפרטורה: ${validated.waterTempC}°C
רמת טחינה: ${validated.grindSize}
פרופיל טעמים: ${validated.flavorNotes.join(', ')}
הערות צוות: ${validated.notes || 'ללא הערות נוספות'}
    `.trim();

    console.log('Synchronized to NotebookLM Google Workspace:', formattedRecipe);

    return {
      success: true,
      message: `המתכון "${validated.recipeTitle}" מסונכרן בהצלחה ל-Google Workspace via NotebookLM!`,
      docId: simulatedDocId,
      calendarEventUrl: `https://calendar.google.com/calendar/r/eventedit?text=סדנת+חליטה+${encodeURIComponent(validated.recipeTitle)}`,
    };
  } catch (error) {
    console.error('Error syncing recipe:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'שגיאה בסנכרון המתכון',
    };
  }
}
