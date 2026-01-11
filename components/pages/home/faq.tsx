import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  return (
    <section className="px-4 md:px-8 py-16 md:py-24 max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tighter">Frequently Asked Questions</h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is Intelli-PDF free to use?</AccordionTrigger>
          <AccordionContent>
            Yes! We offer a generous free tier that allows you to upload documents and generate study materials. We also have a Pro plan for power users who need higher limits.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What kind of files can I upload?</AccordionTrigger>
          <AccordionContent>
            Currently, we support PDF files up to 10MB in size. We are working on adding support for Word documents and PowerPoint presentations soon.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is my data secure?</AccordionTrigger>
          <AccordionContent>
            Absolutely. Your documents are stored securely and are only accessible by you. We do not use your personal documents to train our public AI models.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>How accurate is the AI?</AccordionTrigger>
          <AccordionContent>
            We use advanced Large Language Models (LLMs) like Google Gemini and OpenAI to ensure high accuracy. However, as with all AI, we recommend verifying critical information.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}