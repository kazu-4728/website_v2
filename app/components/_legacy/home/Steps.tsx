import { StepsSection } from '../../../lib/content';

interface Props {
  data: StepsSection;
}

export function Steps({ data }: Props) {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-cloud-white to-mist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          {data.subtitle && (
            <p className="text-primary-600 font-semibold tracking-wider uppercase mb-3 text-sm">
              {data.subtitle}
            </p>
          )}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900">
            {data.title}
          </h2>
          {data.description && (
            <div className="bg-white/90 md:backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl shadow-md inline-block">
              <p className="text-base md:text-lg lg:text-xl text-gray-900 font-medium leading-relaxed tracking-wide">
                {data.description}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {data.items.map((step, index) => (
            <div 
              key={index}
              className="relative bg-white/80 md:backdrop-blur-sm p-6 md:p-8 lg:p-10 rounded-2xl border border-gray-200 hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 group"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                {step.number}
              </div>

              {/* Content */}
              <div className="mt-6">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <div className="bg-white/95 md:backdrop-blur-sm p-4 rounded-lg">
                  <p className="text-sm md:text-base lg:text-lg text-gray-900 font-medium leading-relaxed tracking-wide">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Decorative Arrow (for visual flow) */}
              {index < data.items.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-primary-500/30 text-2xl">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
