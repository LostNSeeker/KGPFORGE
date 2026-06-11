import {
  Globe, Award, Users, GraduationCap, BookOpen, Check
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { getApiUrl } from '../config'
import Carousel from '../components/ui/carousel'
import { Timeline } from '../components/ui/timeline'

export function AboutPage() {
  const [stats, setStats] = useState([
    { label: "Users", value: "0", icon: Users, key: 'users_count' },
    { label: "Founders", value: "0", icon: Award, key: 'founders_count' },
    { label: "Alumni", value: "0", icon: Globe, key: 'alumni_count' },
    { label: "Students", value: "0", icon: GraduationCap, key: 'students_count' },
    { label: "Courses", value: "0", icon: BookOpen, key: 'courses_count' },
    { label: "Services", value: "0", icon: Award, key: 'services_count' }
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(getApiUrl('/api/admin/public-stats'))
        if (res.ok) {
          const data = await res.json()
          setStats(prev => prev.map(s => {
            const remote = data.find((d: any) => d.key === s.key)
            return remote ? { ...s, value: remote.value, label: remote.label } : s
          }))
        }
      } catch (error) {
        console.error('Failed to fetch stats', error)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden font-sans">

      {/* ════════════ HERO with Carousel (full width) ══════════ */}
      <section className="relative min-h-[75vh] flex flex-col pt-24 pb-16 bg-slate-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/60 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/60 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.8)_0%,rgba(248,250,252,1)_100%)]"></div>
        </div>

        <div className="w-full relative z-10 min-h-[70vh]">
          <Carousel hideControls autoPlayInterval={5000}>
            {/* Slide 1: About KGP Forge — image background */}
            <div className="relative w-full min-h-[70vh] flex items-center justify-center">
              <img
                src="https://www.ecell-iitkgp.in/assets/thumbnail5-peRn5kn_.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                aria-hidden
              />
              <div className="absolute inset-0 bg-slate-900/50" />
              <div className="relative z-10 container mx-auto px-6 max-w-5xl text-center py-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 border border-slate-200 rounded-full mb-8 shadow-sm">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-sm font-medium text-slate-600">IIT Kharagpur's Innovation Hub</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
                  About KGP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Forge</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
                  Where <span className="font-semibold text-white">IIT Kharagpur's sharpest minds</span> meet. We help founders get work done at a fair cost and students learn by doing.
                </p>
              </div>
            </div>
            {/* Slide 2: Founders & Students */}
            <div className="relative w-full min-h-[70vh] flex items-center justify-center">
              <img
                src="https://www.ecell-iitkgp.in/assets/Aboutus-Br4Mxt4u.jpeg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                aria-hidden
              />
              <div className="absolute inset-0 bg-slate-900/50" />
              <div className="relative z-10 container mx-auto px-6 max-w-5xl text-center py-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 border border-slate-200 rounded-full mb-8 shadow-sm">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-sm font-medium text-slate-600">Founders & Students</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
                  Get Work Done. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Learn by Doing.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
                  Founders post services at a fair price. Students deliver and build skills. One platform, real outcomes.
                </p>
              </div>
            </div>
            {/* Slide 3: Community First */}
            <div className="relative w-full min-h-[70vh] flex items-center justify-center">
              <img
                src="https://www.ecell-iitkgp.in/assets/work_6_md-DsmfKfjs.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                aria-hidden
              />
              <div className="absolute inset-0 bg-slate-900/50" />
              <div className="relative z-10 container mx-auto px-6 max-w-5xl text-center py-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 border border-slate-200 rounded-full mb-8 shadow-sm">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-medium text-slate-600">Community First</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
                  Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">KGP</span>.
                </h1>
                <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
                  Events, courses, resources, and mentorship — all in one place. Join the community and grow.
                </p>
              </div>
            </div>
            {/* Slide 4: Our Network */}
            <div className="relative w-full min-h-[70vh] flex items-center justify-center">
              <img
                src="https://www.ecell-iitkgp.in/assets/work_8_md-DNZ34xPc.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                aria-hidden
              />
              <div className="absolute inset-0 bg-slate-900/50" />
              <div className="relative z-10 container mx-auto px-6 max-w-5xl text-center py-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 border border-slate-200 rounded-full mb-8 shadow-sm">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-sm font-medium text-slate-600">Our Network</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
                  One community, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">countless connections.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
                  Founders, students, and alumni — all on one platform. Connect, get work done, and grow together.
                </p>
              </div>
            </div>
          </Carousel>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section className="py-16 relative bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-2xl bg-blue-50 text-blue-600 mb-4 ring-1 ring-blue-100/50">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════ OUR JOURNEY TIMELINE ══════════ */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <Timeline
          heading="Our journey"
          subheading="From idea to platform — here’s how KGP Forge grew to connect founders and students."
          data={[
            {
              title: "2024",
              content: (
                <div>
                  <p className="text-slate-700 text-sm md:text-base font-normal mb-8">
                    Launched the Launchpad and full platform: founders can post services at a fair cost,
                    students can find real work and learn by doing. Events, courses, and resources went live.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <img
                      src="https://www.ecell-iitkgp.in/assets/work_1_md-DT05Q56C.jpg"
                      alt="Team collaboration"
                      width={500}
                      height={500}
                      className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-slate-100"
                    />
                    <img
                      src="https://www.ecell-iitkgp.in/assets/work_2_md-DJ9TZPw4.jpg"
                      alt="Community"
                      width={500}
                      height={500}
                      className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-slate-100"
                    />
                    <img
                      src="https://www.ecell-iitkgp.in/assets/work_3_md-AgNFOjw6.jpg"
                      alt="Startup"
                      width={500}
                      height={500}
                      className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-slate-100"
                    />
                    <img
                      src="https://www.ecell-iitkgp.in/assets/work_4_full-D48PtG3O.jpg"
                      alt="Workspace"
                      width={500}
                      height={500}
                      className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-slate-100"
                    />
                  </div>
                </div>
              ),
            },
            {
              title: "Early 2024",
              content: (
                <div>
                  <p className="text-slate-700 text-sm md:text-base font-normal mb-8">
                    Built the core experience: founder and student dashboards, service listings,
                    and the first version of the Launchpad so both sides could connect at a fair cost.
                  </p>
                  <p className="text-slate-700 text-sm md:text-base font-normal mb-8">
                    Added mentorship flows, blog hub, and messaging so the community could learn and collaborate.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <img
                      src="https://www.ecell-iitkgp.in/assets/work_5_md-DTM-utum.jpg"
                      alt="Analytics"
                      width={500}
                      height={500}
                      className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-slate-100"
                    />
                    <img
                      src="https://www.ecell-iitkgp.in/assets/work_6_md-DsmfKfjs.jpg"
                      alt="Events"
                      width={500}
                      height={500}
                      className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-slate-100"
                    />
                    <img
                      src="https://www.ecell-iitkgp.in/assets/work_7_a_md-CQyh96oU.jpg"
                      alt="Knowledge"
                      width={500}
                      height={500}
                      className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-slate-100"
                    />
                    <img
                      src="https://www.ecell-iitkgp.in/assets/work_8_md-DNZ34xPc.jpg"
                      alt="Meeting"
                      width={500}
                      height={500}
                      className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-slate-100"
                    />
                  </div>
                </div>
              ),
            },
            {
              title: "The beginning",
              content: (
                <div>
                  <p className="text-slate-700 text-sm md:text-base font-normal mb-4">
                    KGP Forge started with a simple goal: help founders get work done at a fair cost
                    and give students real experience. Here’s what we shipped first.
                  </p>
                  <div className="mb-8 space-y-2">
                    <div className="flex gap-2 items-center text-slate-700 text-xs md:text-sm">
                      <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      Launchpad services (founders + students)
                    </div>
                    <div className="flex gap-2 items-center text-slate-700 text-xs md:text-sm">
                      <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      Events and workshops
                    </div>
                    <div className="flex gap-2 items-center text-slate-700 text-xs md:text-sm">
                      <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      Resources and investor database
                    </div>
                    <div className="flex gap-2 items-center text-slate-700 text-xs md:text-sm">
                      <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      Courses and knowledge hub
                    </div>
                    <div className="flex gap-2 items-center text-slate-700 text-xs md:text-sm">
                      <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      Alumni connect and mentorship
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <img
                      src="https://www.ecell-iitkgp.in/assets/work_9_a_md-COQfNM1A.jpg"
                      alt="Office"
                      width={500}
                      height={500}
                      className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-slate-100"
                    />
                    <img
                      src="https://www.ecell-iitkgp.in/assets/Aboutus-Br4Mxt4u.jpeg"
                      alt="Collaboration"
                      width={500}
                      height={500}
                      className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-slate-100"
                    />
                    <img
                      src="https://www.ecell-iitkgp.in/assets/thumbnail5-peRn5kn_.jpg"
                      alt="Team"
                      width={500}
                      height={500}
                      className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-slate-100"
                    />
                    <img
                      src="https://www.ecell-iitkgp.in/assets/work_3_md-AgNFOjw6.jpg"
                      alt="Workshop"
                      width={500}
                      height={500}
                      className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-lg border border-slate-100"
                    />
                  </div>
                </div>
              ),
            },
          ]}
        />
      </section>

    </div>
  )
}