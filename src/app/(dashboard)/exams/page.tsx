export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">আমার পরীক্ষাসমূহ</h1>
        <p className="text-muted-foreground">আপনার সকল পরীক্ষার তালিকা এখানে দেখতে পাবেন।</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for exams */}
        <div className="rounded-xl border border-border p-6 bg-card">
          <h3 className="font-semibold text-xl mb-2">মডেল টেস্ট ১</h3>
          <p className="text-sm text-muted-foreground mb-4">সাধারণ জ্ঞান এবং গণিত</p>
          <div className="flex justify-between items-center">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">সম্পন্ন</span>
            <span className="text-sm font-bold">৯০/১০০</span>
          </div>
        </div>
      </div>
    </div>
  );
}
