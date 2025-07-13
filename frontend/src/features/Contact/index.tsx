import { zodResolver } from "@hookform/resolvers/zod";
import { easeOut, motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên của bạn"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Vui lòng nhập chủ đề"),
  message: z.string().min(1, "Vui lòng nhập nội dung"),
});
type ContactFormData = z.infer<typeof contactSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, easeOut } },
};
const cardHoverVariants = {
  hover: { scale: 1.02, y: -5, transition: { duration: 0.3 } },
};

function ContactInfoCard({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <motion.div variants={itemVariants} whileHover="hover">
      <motion.div variants={cardHoverVariants}>
        <Card className="group cursor-pointer overflow-hidden border border-gray-200 shadow-lg backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <motion.div
                className="from-primary to-accent flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Icon className="h-6 w-6 text-white" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-foreground group-hover:text-primary mb-2 font-bold transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{children}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });
  const handleSubmit = (data: ContactFormData) => {
    console.log("Form submitted:", data);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast("Gửi tin nhắn thành công!", {
        description: "Chúng tôi sẽ phản hồi bạn sớm nhất có thể.",
      });
      form.reset();
    }, 1500);
  };
  return (
    <motion.div className="md:col-span-2" variants={itemVariants}>
      <Card className="overflow-hidden border border-gray-200 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Mail className="text-primary mr-3 h-6 w-6" />
            Gửi tin nhắn cho chúng tôi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <motion.div
                className="grid gap-4 md:grid-cols-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ tên của bạn" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Nhập email của bạn" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chủ đề</FormLabel>
                      <FormControl>
                        <Input placeholder="Bạn cần hỗ trợ về gì?" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Nhập nội dung tin nhắn..." rows={6} disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  className="from-primary to-accent hover:from-primary/90 hover:to-accent/90 w-full rounded-xl bg-gradient-to-r py-3 font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ContactMap() {
  return (
    <motion.div variants={itemVariants} className="mt-8">
      <Card className="overflow-hidden border border-gray-200 shadow-xl">
        <CardContent className="p-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="relative"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1991.1947263390857!2d106.80923926970493!3d10.841128916501406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sFPT%20University%20HCMC!5e1!3m2!1sen!2s!4v1749389651458!5m2!1sen!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
            <div className="from-primary/20 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const Contact = () => {
  return (
    <motion.div
      className="container mx-auto p-4 py-6 sm:py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div className="mb-12 rounded-3xl bg-white p-12 text-center shadow bg-gradient-to-r from-primary to-accent" variants={itemVariants}>
          <motion.h1
            className="mb-4 bg-clip-text text-4xl font-bold text-white"
            
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Liên hệ với chúng tôi
          </motion.h1>
          <motion.p
            className="mx-auto max-w-2xl text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Có thắc mắc về sản phẩm hoặc dịch vụ? Chúng tôi luôn sẵn sàng hỗ trợ bạn!
          </motion.p>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-6">
            <ContactInfoCard icon={MapPin} title="Địa chỉ">
              123 Nguyễn Huệ
              <br />
              Quận 1, TP.HCM
              <br />
              Việt Nam
            </ContactInfoCard>
            <ContactInfoCard icon={Phone} title="Điện thoại">
              Hotline: 1800-6789
              <br />
              Chăm sóc khách hàng: 1800-9876
            </ContactInfoCard>
            <ContactInfoCard icon={Mail} title="Email">
              Bán hàng: sales@skindora.site
              <br />
              Hỗ trợ: support@skindora.site
            </ContactInfoCard>
            <ContactInfoCard icon={Clock} title="Giờ làm việc">
              Thứ 2 - Thứ 6: 9:00 - 18:00
              <br />
              Thứ 7: 9:00 - 13:00
              <br />
              Chủ nhật: Nghỉ
            </ContactInfoCard>
          </div>
          <ContactForm />
        </div>
        <ContactMap />
      </div>
    </motion.div>
  );
};

export default Contact;
