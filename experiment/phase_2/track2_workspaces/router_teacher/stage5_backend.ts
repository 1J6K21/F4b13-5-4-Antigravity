// api/lessons.ts
// Simple array of lessons loaded from markdown MDX assets
export default function getLessons(req, res) { res.status(200).json(lessons); }