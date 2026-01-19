import Image from "next/image";
import TesimonialCardBooking from "@/app/common/component/TesimonialCardBooking/TesimonialCardBooking";

export default function TherapistCard() {
	return (
	<div className="bg-[#EAF7FC] rounded-[51.669px] shadow-[0_0_28.183px_rgba(0,0,0,0.25)]">
			<div className=" p-3 ">

			<div className="md:hidden flex justify-between px-4 pt-2  mb-3">
				<div>
					<svg xmlns="http://www.w3.org/2000/svg" width="33" height="21" viewBox="0 0 33 21" fill="none">
						<path d="M31.4058 10.0498H1.40576" stroke="#043953" stroke-width="2.81114" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M9.40576 18.6961L1.40576 10.0507L9.40576 1.40527" stroke="#043953" stroke-width="2.81114" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</div>
				<div>

					<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="13" cy="13" r="13" fill="#043953" />
						<g clip-path="url(#clip0_4681_47)">
							<path d="M19.699 7.30065C18.5182 6.11984 16.629 6.11984 15.448 7.30065L14.8281 7.92057L19.0791 12.1715L19.699 11.5516C20.8798 10.3708 20.8798 8.45201 19.699 7.30065Z" fill="white" />
							<path d="M6.41504 16.3341L6.59208 20.4078L10.6658 20.585L11.3153 19.9355L7.06429 15.6846L6.41504 16.3341Z" fill="white" />
							<path d="M9.11182 16.8735L16.042 9.94336L17.0439 10.9453L10.1137 17.8755L9.11182 16.8735Z" fill="white" />
							<path d="M7.4873 15.269L14.4175 8.33887L15.6281 9.54953L8.69797 16.4797L7.4873 15.269Z" fill="white" />
							<path d="M10.5273 18.311L17.4575 11.3809L18.6682 12.5915L11.738 19.5217L10.5273 18.311Z" fill="white" />
						</g>
						<defs>
							<clipPath id="clip0_4681_47">
								<rect width="15" height="15" fill="white" transform="translate(6 6)" />
							</clipPath>
						</defs>
					</svg>

				</div>
			</div>

			<div className="flex gap-3">
				<div>
					<Image
						src="/img/demoimg.png"
						alt="Therapist"
						width={200}
						height={200}
						className="w-[100px] h-[auto] md:w-[200px] md:h-[auto] rounded-full md:rounded object-cover"
					/>
				</div>

				<div className="grow pr-2 relative flex flex-col justify-evenly">

					<div className="md:flex hidden justify-end absolute right-3 top-2">
						<svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="20.3545" cy="20.3545" r="20.3545" fill="#043953" />
							<path d="M30.7009 29.8771L28.4061 22.9971C28.3743 22.9014 28.3206 22.8147 28.2493 22.7433L16.238 10.7297C15.7506 10.2442 15.091 9.97168 14.4033 9.97168C13.7153 9.97168 13.0556 10.2442 12.5685 10.7297L10.7235 12.5748C10.2374 13.0618 9.96436 13.7216 9.96436 14.4095C9.96436 15.0974 10.2374 15.7573 10.7235 16.2442L22.7462 28.2464C22.8176 28.3178 22.9043 28.3714 23 28.4032L29.88 30.6981C30.1134 30.7766 30.3711 30.7163 30.5452 30.5421C30.7194 30.368 30.7796 30.1103 30.7011 29.8769L30.7009 29.8771ZM11.6526 13.4834L13.4977 11.6383C13.7421 11.3932 14.0742 11.2555 14.4202 11.2555C14.7664 11.2555 15.0983 11.3932 15.3427 11.6383L16.5628 12.8584L12.8726 16.5393L11.6526 15.3192C11.4092 15.0758 11.2726 14.7455 11.2726 14.4013C11.2726 14.057 11.4092 13.7268 11.6526 13.4834V13.4834ZM13.7905 17.4572L14.9437 16.304L24.2152 25.5755V25.5757C24.4624 25.8228 24.8227 25.9194 25.1605 25.8289C25.4981 25.7384 25.7619 25.4747 25.8523 25.1369C25.9428 24.7993 25.8462 24.4389 25.5991 24.1918L16.3276 14.9203L17.4808 13.7671L27.2252 23.5531L28.2745 26.7036L26.7063 28.2719L23.5558 27.2225L13.7905 17.4572Z" fill="white" />
						</svg>

					</div>
					<div>
						<p className="f-28-18-auto mb-0 fw-500">Individual Therapy </p>
						<p className="f-36-18-auto mb-0 fw-800 text-color-green capitalize lh-cus-set">Vikasine  Pramodh</p>
					</div>
					<div>
						<div className="md:block hidden">
							<p className="f-20"><b>⭐Therapist Rating:</b> 4.9/5</p>
							<p className="f-20"><b>👍Recommended By:</b> 500+ Clients</p>
						</div>
						<div className="md:hidden block">
							<p className="f-16">⭐ 4.9/5 | 100+ Clients</p>
						</div>

					</div>
				</div>
			</div>

			<div className="md:flex hidden justify-center my-3">
				<TesimonialCardBooking />

			</div>

			<div className="md:flex hidden justify-between px-4 pt-2  mb-3">
				<p className="f-19"><b>Recommended For:</b> <br /> Anxiety, Depression, Relationship, Trauma, Sleep</p>
			</div>
			

		</div>
		<div className="bg-white rounded-b-[51.669px] p-4 flex justify-center gap-3 items-center">
				<div>
					<svg className="md:block hidden" xmlns="http://www.w3.org/2000/svg" width="28" height="23" viewBox="0 0 28 23" fill="none">
						<path d="M17.5663 2.05957C11.9518 2.05957 7.40063 5.81048 7.40063 10.4375C7.40063 15.0644 11.9519 18.8153 17.5663 18.8153C17.8754 18.8153 18.1808 18.802 18.4827 18.7797C20.5486 20.9051 23.8541 22.0213 25.101 22.3837C25.1741 22.405 25.2527 22.3775 25.2969 22.3156C25.3408 22.2535 25.3411 22.1704 25.2971 22.1083C24.7178 21.2797 23.4905 19.3175 23.3146 17.3466C25.9818 15.8364 27.7319 13.3059 27.7319 10.4378C27.7319 5.81103 23.1806 2.05988 17.5663 2.05988V2.05957Z" fill="#043953" />
						<path d="M0.699013 17.9192C1.73136 17.6204 4.26741 16.7698 6.17797 15.2045C6.61948 15.3411 7.06934 15.4503 7.5245 15.5311C6.4513 14.0486 5.86953 12.2673 5.86048 10.4372C5.86048 5.99062 9.33017 2.21898 14.1008 0.961502C12.6606 0.320715 11.101 -0.00680409 9.52466 0.000107143C4.26454 0.000107143 0 3.51615 0 7.85506C0.031536 9.84305 0.895708 11.7266 2.38193 13.0474C2.27107 14.9455 1.07534 16.8654 0.517731 17.6634V17.6636C0.475921 17.721 0.475682 17.7988 0.516775 17.8567C0.557868 17.9145 0.631453 17.9398 0.699543 17.9193L0.699013 17.9192Z" fill="#043953" />
					</svg>
					<svg  className="md:hidden block" xmlns="http://www.w3.org/2000/svg" width="18" height="15" viewBox="0 0 18 15" fill="none">
  <path d="M11.2191 1.31543C7.63332 1.31543 4.72656 3.71106 4.72656 6.66621C4.72656 9.62137 7.63336 12.017 11.2191 12.017C11.4166 12.017 11.6116 12.0084 11.8045 11.9943C13.1239 13.3517 15.2351 14.0646 16.0314 14.2961C16.0781 14.3096 16.1283 14.2921 16.1565 14.2526C16.1846 14.2129 16.1848 14.1598 16.1567 14.1201C15.7867 13.5909 15.0028 12.3377 14.8905 11.0789C16.594 10.1144 17.7117 8.49821 17.7117 6.66641C17.7117 3.71141 14.8049 1.31563 11.2191 1.31563V1.31543Z" fill="#043953"/>
  <path d="M0.446445 11.4446C1.10578 11.2538 2.72551 10.7105 3.94574 9.71078C4.22773 9.79806 4.51504 9.86779 4.80574 9.91937C4.12031 8.97257 3.74875 7.83487 3.74297 6.66605C3.74297 3.82608 5.95898 1.41722 9.00586 0.614092C8.08605 0.204834 7.08996 -0.00434563 6.0832 6.84297e-05C2.72367 6.84297e-05 0 2.24569 0 5.01687C0.0201414 6.28655 0.57207 7.48956 1.52129 8.33308C1.45049 9.54538 0.686797 10.7716 0.330664 11.2812V11.2814C0.303961 11.318 0.303808 11.3678 0.330054 11.4047C0.356299 11.4416 0.403296 11.4578 0.446784 11.4447L0.446445 11.4446Z" fill="#043953"/>
</svg>
				</div>

				<div>
					<p className="  text-gray-700 mb-0 f-22-16-auto">
						Offline Session in Kormangala | 60 min
					</p>
				</div>
			</div>
	</div>
		
	);
}
