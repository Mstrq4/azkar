//username
'use client';
export default function UserItem() {
    return (
        <div dir="ltr" className="flex min-h-[8px] min-w-[8px] items-center justify-between gap-2 cursor-pointer">
            <div className="avatar p-1 rounded-full min-h-8 min-w-8 bg-cyan-700 text-white font-[300] flex justify-center items-center">
                <p className="text-[14px]">YM</p>
            </div>
        </div>
    )
}