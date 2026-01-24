import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, Lock, Eye, Database, Mail, Clock, Globe } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "**Personal Information**: When you create an account, we collect your email address and any profile information you choose to provide.",
        "**Usage Data**: We automatically collect information about how you use our services, including the types of documents you process (but not the content), features used, and interaction patterns.",
        "**Device Information**: We collect information about the device you use to access our services, including browser type, operating system, and IP address.",
        "**Files**: When you upload files for processing, they are temporarily stored on our servers only for the duration needed to complete the requested operation.",
      ],
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "**Service Delivery**: To provide, maintain, and improve our PDF processing services.",
        "**Communication**: To send you service updates, security alerts, and support messages.",
        "**Analytics**: To understand how users interact with our platform and improve user experience.",
        "**Legal Compliance**: To comply with applicable laws and regulations.",
      ],
    },
    {
      icon: Shield,
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your data, including SSL/TLS encryption for data in transit.",
        "Files are processed in secure, isolated environments and are automatically deleted after processing is complete.",
        "We do not store the content of your documents beyond the time required for processing.",
        "Access to personal data is restricted to authorized personnel only.",
      ],
    },
    {
      icon: Eye,
      title: "Your Rights",
      content: [
        "**Access**: You can request a copy of your personal data at any time.",
        "**Correction**: You can update or correct your personal information through your account settings.",
        "**Deletion**: You can request deletion of your account and associated data.",
        "**Data Portability**: You can request your data in a machine-readable format.",
        "**Opt-out**: You can opt out of marketing communications at any time.",
      ],
    },
    {
      icon: Globe,
      title: "Cookies & Tracking",
      content: [
        "We use essential cookies to ensure the proper functioning of our website.",
        "Analytics cookies help us understand how you use our services (you can opt out of these).",
        "We do not use advertising or third-party tracking cookies.",
        "You can manage cookie preferences through your browser settings.",
      ],
    },
    {
      icon: Mail,
      title: "Third-Party Services",
      content: [
        "We may use third-party services for analytics, email delivery, and payment processing.",
        "These providers are contractually bound to protect your data and use it only for specified purposes.",
        "We do not sell your personal information to third parties.",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy - Document Editor | Data Protection & Terms</title>
        <meta name="description" content="Learn how Document Editor protects your privacy and handles your data. Read our comprehensive privacy policy and terms of service." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 pt-24">
          {/* Hero Section */}
          <section className="py-16">
            <div className="container max-w-4xl mx-auto px-4">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                  <Shield className="w-3 h-3 mr-1" />
                  Legal
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Privacy Policy
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                </p>
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: January 24, 2026</span>
                </div>
              </div>
            </div>
          </section>

          {/* Overview */}
          <section className="pb-8">
            <div className="container max-w-4xl mx-auto px-4">
              <div className="bg-muted/30 rounded-xl p-6 md:p-8 border border-border/50">
                <h2 className="text-xl font-semibold mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Document Editor ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
                  explains how we collect, use, disclose, and safeguard your information when you use our website 
                  and PDF processing services. By using our services, you agree to the collection and use of 
                  information in accordance with this policy.
                </p>
              </div>
            </div>
          </section>

          {/* Policy Sections */}
          <section className="py-8">
            <div className="container max-w-4xl mx-auto px-4">
              <div className="space-y-8">
                {sections.map((section, index) => (
                  <div key={index} className="bg-card/50 rounded-xl p-6 md:p-8 border border-border/50">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <section.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold pt-1">{section.title}</h2>
                    </div>
                    <ul className="space-y-3 ml-14">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-muted-foreground leading-relaxed">
                          {item.split('**').map((part, partIndex) => 
                            partIndex % 2 === 1 ? (
                              <strong key={partIndex} className="text-foreground">{part}</strong>
                            ) : (
                              part
                            )
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Terms of Service Summary */}
          <section className="py-16 bg-muted/30">
            <div className="container max-w-4xl mx-auto px-4">
              <div className="text-center mb-8">
                <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                  <FileText className="w-3 h-3 mr-1" />
                  Terms of Service
                </Badge>
                <h2 className="text-3xl font-bold mb-4">Terms & Conditions</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-card/50 rounded-xl p-6 border border-border/50">
                  <h3 className="font-semibold mb-3">Acceptable Use</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    You agree to use our services only for lawful purposes and in accordance with these terms. 
                    You shall not use our services to process illegal content, infringe on intellectual property 
                    rights, or engage in any activity that could harm our services or other users.
                  </p>
                </div>

                <div className="bg-card/50 rounded-xl p-6 border border-border/50">
                  <h3 className="font-semibold mb-3">Intellectual Property</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    The Document Editor platform, including its design, features, and content, is protected by 
                    copyright and other intellectual property laws. You retain all rights to your documents and 
                    files processed through our services.
                  </p>
                </div>

                <div className="bg-card/50 rounded-xl p-6 border border-border/50">
                  <h3 className="font-semibold mb-3">Limitation of Liability</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Our services are provided "as is" without warranties of any kind. We are not liable for any 
                    indirect, incidental, or consequential damages arising from your use of our services. Our 
                    total liability shall not exceed the amount paid for our services in the past 12 months.
                  </p>
                </div>

                <div className="bg-card/50 rounded-xl p-6 border border-border/50">
                  <h3 className="font-semibold mb-3">Changes to Terms</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We reserve the right to modify these terms at any time. We will notify users of significant 
                    changes via email or through our platform. Continued use of our services after changes 
                    constitutes acceptance of the new terms.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-16">
            <div className="container max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Questions?</h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about this Privacy Policy or our Terms of Service, please contact us.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Mail className="w-4 h-4" />
                Contact Us
              </a>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
