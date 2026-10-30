export interface ToolGuideProps {
  id: string;
  title: string;
  steps: string[];
  uses: string[];
  noteTitle: string;
  note: string;
  faqs: { q: string; a: string }[];
}

const ToolGuide = ({ id, title, steps, uses, noteTitle, note, faqs }: ToolGuideProps) => (
  <section className="border-t border-border" aria-labelledby={id}>
    <div className="container mx-auto max-w-3xl px-6 py-10 space-y-8">
      <div>
        <h2 id={id} className="text-2xl font-bold mb-3">{title}</h2>
        <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
          {steps.map((s) => <li key={s}>{s}</li>)}
        </ol>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Common uses</h3>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          {uses.map((u) => <li key={u}>{u}</li>)}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">{noteTitle}</h3>
        <p className="text-muted-foreground">{note}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Frequently asked questions</h3>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q}>
              <p className="font-medium">{f.q}</p>
              <p className="text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ToolGuide;
