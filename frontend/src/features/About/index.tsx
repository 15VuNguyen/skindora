import { motion } from "framer-motion";
import { Award, CheckCircle, Heart, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.3 },
  },
};

function AboutHeader() {
  return (
    <motion.div
      className="from-primary/10 via-accent/10 to-secondary/20 mb-12 rounded-3xl bg-gradient-to-br p-12 text-center"
      variants={itemVariants}
    >
      <motion.h1
        className="from-primary to-accent mb-6 bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        Về Skindora
      </motion.h1>
      <motion.p
        className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Đối tác đáng tin cậy của bạn trong lĩnh vực chăm sóc da, kết hợp giữa khoa học và thiên nhiên để mang lại làn da
        khỏe mạnh, rạng rỡ.
      </motion.p>
    </motion.div>
  );
}

function AboutStory() {
  return (
    <motion.div variants={itemVariants}>
      <Card className="from-card to-card/80 overflow-hidden border border-gray-200 bg-gradient-to-br shadow-xl">
        <CardContent className="p-0">
          <div className="grid items-center gap-0 md:grid-cols-1">
            <motion.div
              className="p-8 lg:p-12"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <div className="mb-4 flex items-center">
                <Heart className="text-primary mr-3 h-8 w-8" />
                <h2 className="text-foreground text-3xl font-bold">Câu chuyện của chúng tôi</h2>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Thành lập năm 2025, Skindora Skincare ra đời từ niềm đam mê kết hợp chuyên môn dược phẩm với các giải
                pháp chăm sóc da tự nhiên. Sứ mệnh của chúng tôi là mang đến các sản phẩm chăm sóc da hiệu quả, dựa trên
                khoa học, phù hợp với mọi người.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Chúng tôi đề cao sự minh bạch, chất lượng và phát triển bền vững. Mỗi sản phẩm đều được nghiên cứu kỹ
                lưỡng với thành phần đã được kiểm chứng và thử nghiệm nghiêm ngặt để đảm bảo an toàn, hiệu quả cao nhất.
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AboutValues() {
  const values = [
    {
      icon: "🌿",
      title: "Thành phần tự nhiên",
      description: "Ưu tiên sử dụng thành phần tự nhiên, bền vững, thân thiện với làn da.",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      icon: "🧪",
      title: "Dựa trên khoa học",
      description: "Tất cả công thức đều được phát triển và kiểm nghiệm bởi chuyên gia da liễu.",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: "♻️",
      title: "Phát triển bền vững",
      description: "Cam kết bảo vệ môi trường và sử dụng bao bì thân thiện sinh thái.",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
  ];
  return (
    <motion.div className="grid gap-6 md:grid-cols-3" variants={containerVariants}>
      {values.map((value, index) => (
        <motion.div key={index} variants={cardVariants} whileHover="hover">
          <Card
            className={`h-full border border-gray-200 bg-gradient-to-br shadow-lg ${value.gradient} backdrop-blur-sm`}
          >
            <CardContent className="flex h-full flex-col p-6 text-center">
              <motion.div className="mb-6">
                <span className="text-3xl">{value.icon}</span>
              </motion.div>
              <h3 className="text-foreground mb-3 text-xl font-bold">{value.title}</h3>
              <p className="text-muted-foreground flex-grow leading-relaxed">{value.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

function AboutTeam() {
  const members = [
    {
      name: "BS.Trần Anh Vỹ",
      role: "Nhà sáng lập & Bác sĩ da liễu trưởng",
      image: "https://i.ibb.co/JwjhdV39/2d6b83ced511614f3800.jpg",
    },
    {
      name: "Trần Anh Vỹ",
      role: "Trưởng phòng phát triển sản phẩm",
      image: "https://i.ibb.co/JwjhdV39/2d6b83ced511614f3800.jpg",
    },
    {
      name: "Trần Anh Vỹ",
      role: "Quản lý kiểm soát chất lượng",
      image: "https://i.ibb.co/JwjhdV39/2d6b83ced511614f3800.jpg",
    },
  ];
  return (
    <motion.div variants={itemVariants}>
      <Card className="from-card to-secondary/10 border border-gray-200 bg-gradient-to-br shadow-xl">
        <CardContent className="p-8">
          <motion.div
            className="mb-8 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Users className="text-primary mr-3 h-8 w-8" />
            <h2 className="from-primary to-accent bg-gradient-to-r bg-clip-text text-center text-3xl font-bold text-transparent">
              Đội ngũ của chúng tôi
            </h2>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {members.map((member, index) => (
              <motion.div
                key={index}
                className="group text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
              >
                <motion.div
                  className="relative mx-auto mb-4 h-32 w-32"
                  whileHover={{ scale: 1.1, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="ring-primary/20 group-hover:ring-primary/40 h-full w-full rounded-full object-cover shadow-lg ring-4 transition-all duration-300"
                  />
                  <div className="from-primary/20 absolute inset-0 rounded-full bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </motion.div>
                <h3 className="text-foreground mb-1 font-bold">{member.name}</h3>
                <p className="text-muted-foreground text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AboutCerts() {
  const certs = ["ISO 9001", "GMP", "HALAL", "ORGANIC"];
  return (
    <motion.div variants={itemVariants}>
      <Card className="from-accent/5 to-primary/5 border border-gray-200 bg-gradient-to-br shadow-xl">
        <CardContent className="p-8 text-center">
          <motion.div
            className="mb-8 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <Award className="text-primary mr-3 h-8 w-8" />
            <h2 className="from-primary to-accent bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
              Chứng nhận của chúng tôi
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {certs.map((cert, index) => (
              <motion.div
                key={index}
                className="border-primary/20 from-card to-primary/5 group cursor-pointer rounded-2xl border bg-gradient-to-br p-6 shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.7 + index * 0.1, duration: 0.4 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="mb-3 flex items-center justify-center">
                  <CheckCircle className="text-primary group-hover:text-accent h-8 w-8 transition-colors duration-300" />
                </div>
                <p className="text-foreground group-hover:text-primary font-bold transition-colors duration-300">
                  {cert}
                </p>
                <p className="text-muted-foreground text-sm">Đã được chứng nhận</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const AboutUs = () => {
  return (
    <div className="container mx-auto p-4 py-6 sm:py-8">
      <motion.div
        className="mx-auto max-w-4xl space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AboutHeader />
        <AboutStory />
        <AboutValues />
        <AboutTeam />
        <AboutCerts />
      </motion.div>
    </div>
  );
};

export default AboutUs;
