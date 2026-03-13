import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  HeartPulse, UserRound, Users, Stethoscope, 
  MapPin, CheckCircle, ChevronRight, Copy, Mail, ShieldCheck, Award, Phone
} from "lucide-react"

import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  position: z.string().min(1, "Please select a position"),
  province: z.string().min(1, "Please select a province"),
  experience: z.string().min(1, "Please specify your experience"),
  message: z.string().optional(),
})

export default function Home() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      position: "",
      province: "",
      experience: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.fullName,
          email: values.email,
          phone: values.phone,
          position: values.position,
          province: values.province,
          experience: values.experience,
          message: values.message,
        }),
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Application Submitted!",
          description: "Your application has been sent to our recruitment team. We'll be in touch soon!",
          variant: "default",
        })
        form.reset()
      } else {
        throw new Error(data.error || "Submission failed")
      }
    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description: err.message || "Please try again or email us directly at healthcrewprovider@gmail.com",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyEmail = () => {
    navigator.clipboard.writeText("healthcrewprovider@gmail.com")
    toast({
      title: "Copied!",
      description: "Email address copied to clipboard.",
    })
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* landing page hero medical professionals working in modern hospital */}
          <img 
            src="https://images.unsplash.com/photo-1584516150909-c43483ee7932?w=1920&h=1080&fit=crop" 
            alt="Medical professionals" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient Overlay to ensure readability and match brand */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/40"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent-foreground backdrop-blur-sm mb-6 shadow-sm">
                <HeartPulse className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold tracking-wide text-white">Canadian Staffing Excellence</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-6">
                Canada's Trusted <br/>
                <span className="text-accent">Healthcare Staffing</span> Agency
              </h1>
              
              <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl leading-relaxed">
                Connecting skilled healthcare professionals with top employers across every province. Your career matters — we match you with the right opportunity.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="accent" onClick={() => scrollToSection('contact')}>
                  Submit Your Resume
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <button
                  onClick={() => scrollToSection('roles')}
                  className="h-14 rounded-2xl px-10 text-base font-semibold text-white border-2 border-white/50 hover:bg-white/15 transition-all duration-300 active:scale-95"
                >
                  Browse Roles
                </button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-white/10">
                {[
                  { value: "500+", label: "Placements" },
                  { value: "7+", label: "Provinces" },
                  { value: "10+", label: "Years Experience" },
                  { value: "95%", label: "Satisfaction Rate" }
                ].map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-3xl font-display font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-primary-foreground/70 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">About Health Crew Provider</h2>
              <div className="w-20 h-1.5 bg-accent mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-muted-foreground">
                We are a premier healthcare staffing agency dedicated to connecting passionate professionals 
                like LPNs, PSWs, HSWs, and RPNs with facilities that urgently need their skills across Canada.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <ShieldCheck className="w-8 h-8 text-accent" />,
                  title: "Trusted Placements",
                  desc: "We rigorously vet all facilities to ensure our staff work in safe, supportive, and rewarding environments."
                },
                {
                  icon: <MapPin className="w-8 h-8 text-accent" />,
                  title: "Canada-Wide Network",
                  desc: "From British Columbia to Nova Scotia, our expansive network means you can work where you want to live."
                },
                {
                  icon: <UserRound className="w-8 h-8 text-accent" />,
                  title: "Dedicated Support",
                  desc: "Our team provides 24/7 support, helping with licensing, relocation advice, and ongoing career development."
                }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-card p-8 rounded-2xl shadow-md border border-border/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ROLES WE PLACE SECTION */}
        <section id="roles" className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Roles We Place</h2>
                <div className="w-20 h-1.5 bg-accent rounded-full mb-6"></div>
                <p className="text-lg text-muted-foreground">
                  We specialize in matching qualified nursing and support staff with rewarding roles in hospitals, 
                  long-term care facilities, and home care environments.
                </p>
              </div>
              <Button onClick={() => scrollToSection('contact')} variant="outline" className="hidden md:flex mt-6 md:mt-0">
                Apply for a Role
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "LPN", full: "Licensed Practical Nurse", icon: <Stethoscope />, desc: "Provide essential frontline care, administer medications, and monitor patient health in diverse clinical settings." },
                { title: "PSW", full: "Personal Support Worker", icon: <Users />, desc: "Assist clients with daily living activities, ensuring comfort, dignity, and a high quality of life." },
                { title: "HSW", full: "Home Support Worker", icon: <HeartPulse />, desc: "Deliver compassionate in-home care, helping individuals maintain independence in their own residences." },
                { title: "RPN", full: "Registered Practical Nurse", icon: <Award />, desc: "Execute complex care plans, collaborate with healthcare teams, and advocate for patient wellbeing." }
              ].map((role, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -8 }}
                  className="bg-card p-6 rounded-2xl shadow-sm border border-border group hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {role.icon}
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-foreground">{role.title}</h3>
                  </div>
                  <h4 className="text-sm font-semibold text-primary mb-4">{role.full}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">{role.desc}</p>
                  <div className="mt-auto flex items-center text-sm font-semibold text-accent group-hover:translate-x-1 transition-transform">
                    Learn more <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </motion.div>
              ))}
            </div>
            
            <Button onClick={() => scrollToSection('contact')} className="w-full mt-8 md:hidden">
              Apply for a Role
            </Button>
          </div>
        </section>

        {/* REGIONAL JOB DEMAND TABLE SECTION */}
        <section id="regions" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-accent blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Healthcare Job Demand Across Canada</h2>
              <div className="w-20 h-1.5 bg-accent mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-primary-foreground/80">
                Estimated active vacancies by province and role — sourced from Government of Canada Job Bank, CIHI, and Statistics Canada workforce surveys.
              </p>
            </div>

            <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-foreground whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-border">
                    <tr>
                      <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-slate-700">Province</th>
                      <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-slate-700">LPN</th>
                      <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-slate-700">PSW</th>
                      <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-slate-700">HSW</th>
                      <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-slate-700">RPN</th>
                      <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-primary bg-primary/5">Total Openings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { prov: "Ontario", lpn: "1,100", psw: "4,200", hsw: "980", rpn: "560", total: "6,840" },
                      { prov: "British Columbia", lpn: "750", psw: "1,850", hsw: "510", rpn: "380", total: "3,490" },
                      { prov: "Alberta", lpn: "690", psw: "1,650", hsw: "460", rpn: "340", total: "3,140" },
                      { prov: "Quebec", lpn: "530", psw: "2,100", hsw: "430", rpn: "210", total: "3,270" },
                      { prov: "Manitoba", lpn: "290", psw: "780", hsw: "225", rpn: "160", total: "1,455" },
                      { prov: "Saskatchewan", lpn: "260", psw: "650", hsw: "195", rpn: "135", total: "1,240" },
                      { prov: "Nova Scotia", lpn: "215", psw: "520", hsw: "160", rpn: "110", total: "1,005" }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {row.prov}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{row.lpn}</td>
                        <td className="px-6 py-4 text-muted-foreground">{row.psw}</td>
                        <td className="px-6 py-4 text-muted-foreground">{row.hsw}</td>
                        <td className="px-6 py-4 text-muted-foreground">{row.rpn}</td>
                        <td className="px-6 py-4 font-bold text-primary bg-primary/5">{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-center text-sm text-primary-foreground/60 mt-6 italic">
              * Estimates based on data from Government of Canada Job Bank, Canadian Institute for Health Information (CIHI), and Statistics Canada Job Vacancy &amp; Wage Survey. LPN national vacancy rate: 12.8% (CIHI 2024). PSW shortage nationally: 34,400+ openings projected by 2031 (ESDC/COPS).
            </p>
          </div>
        </section>

        {/* CONTACT / APPLY SECTION */}
        <section id="contact" className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Apply Now – Submit Your Resume</h2>
              <div className="w-20 h-1.5 bg-accent mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-muted-foreground">
                Ready to take the next step? Fill out the form below or email us directly. We are always looking for exceptional talent.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12 items-start">
              
              {/* Email Prominent Display */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-primary border border-primary-border rounded-2xl p-8 text-center shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-accent"></div>
                  <Mail className="w-12 h-12 mx-auto text-accent mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Email Us Directly</h3>
                  <p className="text-primary-foreground/80 mb-6">Send your resume and cover letter directly to our recruitment team.</p>
                  
                  <div className="bg-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-center gap-3 backdrop-blur-sm">
                    <a href="mailto:healthcrewprovider@gmail.com" className="text-sm sm:text-base font-semibold text-white hover:text-accent transition-colors break-all">
                      healthcrewprovider@gmail.com
                    </a>
                    <Button variant="outline" size="icon" className="shrink-0 bg-transparent border-white/20 text-white hover:bg-white/20" onClick={copyEmail} title="Copy email address">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-4">Why Apply With Us?</h3>
                  <ul className="space-y-4">
                    {[
                      "Competitive compensation packages",
                      "Flexible scheduling options",
                      "Career advancement support",
                      "Placement in top-tier facilities"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2 bg-card rounded-2xl p-8 shadow-xl border border-border/60">
                <h3 className="text-2xl font-bold text-foreground mb-8">Application Form</h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" className="bg-muted/50" {...field} />
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
                            <FormLabel className="text-foreground">Email Address *</FormLabel>
                            <FormControl>
                              <Input placeholder="jane@example.com" type="email" className="bg-muted/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" type="tel" className="bg-muted/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Position Applying For *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-muted/50">
                                  <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="lpn">LPN (Licensed Practical Nurse)</SelectItem>
                                <SelectItem value="psw">PSW (Personal Support Worker)</SelectItem>
                                <SelectItem value="hsw">HSW (Home Support Worker)</SelectItem>
                                <SelectItem value="rpn">RPN (Registered Practical Nurse)</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Province *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-muted/50">
                                  <SelectValue placeholder="Select province" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="on">Ontario</SelectItem>
                                <SelectItem value="bc">British Columbia</SelectItem>
                                <SelectItem value="ab">Alberta</SelectItem>
                                <SelectItem value="qc">Quebec</SelectItem>
                                <SelectItem value="mb">Manitoba</SelectItem>
                                <SelectItem value="sk">Saskatchewan</SelectItem>
                                <SelectItem value="ns">Nova Scotia</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Years of Experience *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-muted/50">
                                  <SelectValue placeholder="Select experience" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="<1">Less than 1 year</SelectItem>
                                <SelectItem value="1-3">1 - 3 years</SelectItem>
                                <SelectItem value="3-5">3 - 5 years</SelectItem>
                                <SelectItem value="5-10">5 - 10 years</SelectItem>
                                <SelectItem value="10+">10+ years</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Message / Cover Letter</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us a bit about yourself and your career goals..." 
                              className="min-h-[120px] bg-muted/50 resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Resume Upload</label>
                      <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/50 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-3 text-muted-foreground" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (MAX. 10MB)</p>
                          </div>
                          <input id="dropzone-file" type="file" className="hidden" accept=".pdf,.doc,.docx" />
                        </label>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full text-base h-14 mt-4" disabled={isSubmitting}>
                      {isSubmitting ? "Sending Application..." : "Send Application"}
                    </Button>
                  </form>
                </Form>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#112238] text-slate-300 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand */}
            <div className="space-y-6">
              <div className="bg-white p-2 rounded-lg inline-block">
                <img 
                  src={`${import.meta.env.BASE_URL}logo.jpeg`} 
                  alt="Health Crew Provider Logo" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                Canada's trusted healthcare staffing agency connecting skilled professionals with the facilities that need them most.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-accent transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-accent transition-colors">About Us</a></li>
                <li><a href="#roles" className="hover:text-accent transition-colors">Roles We Place</a></li>
                <li><a href="#regions" className="hover:text-accent transition-colors">Job Demand Regions</a></li>
              </ul>
            </div>

            {/* Regions */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Provinces Covered</h4>
              <ul className="space-y-3 text-sm grid grid-cols-2 gap-x-4">
                <li>Ontario</li>
                <li>British Columbia</li>
                <li>Alberta</li>
                <li>Quebec</li>
                <li>Manitoba</li>
                <li>Saskatchewan</li>
                <li>Nova Scotia</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Contact Us</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-accent shrink-0" />
                  <a href="mailto:healthcrewprovider@gmail.com" className="hover:text-white transition-colors break-all">
                    healthcrewprovider@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-accent shrink-0" />
                  <a href="tel:+18005550199" className="hover:text-white transition-colors">
                    1-800-555-0199
                  </a>
                </li>
                <li className="flex items-center gap-3 mt-6">
                  <Button onClick={() => scrollToSection('contact')} variant="accent" size="sm" className="w-full">
                    Apply Now
                  </Button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Health Crew Provider. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
