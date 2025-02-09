export default function DigiNewsSkeleton(){
    return (
        <div className="flex-1 p-4 md:p-6 pt-0 overflow-y-auto">
        <div className="space-y-6">
            {[...Array(5)].map((_, index) => (
            <article
                key={index}
                className="border-b border-gray-200 pb-6 last:border-0 relative animate-pulse"
            >
                <div className="flex items-start gap-3">
                {/* أيقونة المصدر الوهمية */}
                <div className="bg-gray-300 p-1.5 rounded text-sm font-medium min-w-[28px] h-[28px]"></div>

                <div className="flex-1 min-w-0">
                    {/* مصدر الخبر */}
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-1"></div>

                    {/* عنوان الخبر */}
                    <div className="h-6 bg-gray-300 rounded w-2/3 mb-2"></div>

                    {/* توقيت النشر */}
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>

                {/* زر التعديل الوهمي */}
                <div className="bg-gray-300 p-3 rounded-lg h-8 w-8"></div>
                </div>

                {/* شارة "منشورة" الوهمية */}
                {/* <div className="absolute top-0 right-0 bg-gray-300 px-4 py-1 rounded h-5 w-20"></div> */}
            </article>
            ))}
        </div>
        </div>

    )
}