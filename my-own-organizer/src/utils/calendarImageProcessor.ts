import { createWorker } from 'tesseract.js';

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  calendar: string;
  isCanceled?: boolean;
}

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const parseCalendarText = (text: string): CalendarEvent[] => {
  const lines = text.split('\n');
  const newEvents: CalendarEvent[] = [];
  let currentDate: Date | null = null;

  lines.forEach(line => {
    const timeMatch = line.match(/(\d{1,2})\s*(AM|PM)/i);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1]);
      const isPM = timeMatch[2].toUpperCase() === 'PM';
      currentDate = new Date();
      currentDate.setHours(isPM ? hour + 12 : hour, 0, 0, 0);
    }

    if (line.includes('Microsoft Teams Meeting') && currentDate) {
      const title = line.split('Microsoft Teams Meeting')[0].trim();
      const endDate = new Date(currentDate);
      endDate.setHours(endDate.getHours() + 1);

      newEvents.push({
        id: Date.now() + Math.random(),
        title,
        start: new Date(currentDate),
        end: endDate,
        calendar: 'personal',
        isCanceled: line.toLowerCase().includes('canceled')
      });
    }
  });

  return newEvents;
};

export const processCalendarImage = async (file: File): Promise<CalendarEvent[]> => {
  try {
    const worker = await createWorker('eng');
    const imageData = await readFileAsDataURL(file);
    const { data: { text } } = await worker.recognize(imageData);
    const events = parseCalendarText(text);
    await worker.terminate();
    return events;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};
