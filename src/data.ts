import { Haircut, Professional, Booking, User } from './types';

export const INITIAL_HAIRCUTS: Haircut[] = [
  {
    id: 'h1',
    title: 'Fade Progressivo',
    price: 45,
    duration: 45,
    description: 'Nossa assinatura degradê skin fade ultra suave e preciso com acabamento simétrico.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBezVMnuGpME9Qbat04obvNgPJyJ145_fQ4bgN9oq5nCVh1V6iSeVa0RIwkEYoUrX68cCRgCxhyZNx2MRrhiQKHaFSzBRTSkWeOWgxJGtgVX24Qmje1qQOyc3YHus1m3q-Tt56VVJ7mggOzwyuxIg84iaQFNxi3SqSDzaHjsvn7ghc_EhyCRd3B5eU2-mwXhWjIjQ1AXGaUAUZvDl45aY10v1KVVKtmqUsS_YIaRbaVW9YrQzIetZbRL_zD10Uxv6R28g5vSXRNAZI',
    category: 'fade'
  },
  {
    id: 'h2',
    title: 'Pompadour Moderno',
    price: 55,
    duration: 60,
    description: 'Toque contemporâneo no clássico Pompadour volumoso e estiloso.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfInkULGBEfdcHBv6j2izcvAju-JFF5d3PKrdSFxcE-JMl-b5InTSNwbpLGjpU0OC9AW0DP3v-dgl5-4IEE_ChPtv1rjGWQjLFmBlusGJ3UJKORB2tCAJTgcOG7U9a0s_uaDKVQ2fjSg8atvYJaVJ6znJ_sx3e7S7bEftc1W5xGTWf54zWKEpAT8h-Zhk2h6BpwoDbAUN_89vpdlqq2fFgM2Yetv_-ExD_qAzpMoiMdCRpUZ_-uzsJfzHzr1gdcc4dBGfEMgp1CVQ',
    category: 'classic'
  },
  {
    id: 'h3',
    title: 'Executive Buzz',
    price: 35,
    duration: 30,
    description: 'Corte raspado simétrico de alta precisão com navalha para look limpo e corporativo.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbciCTwT__Tjj2-4JyjrkGjA26t3bMaiYZT1iV1F9FPEB3150hk8OctXaWVDtPiNIz0TSCcK0-Byt1UHxp_iQhkfkn3Q_u3KrqWYKi0rdoawCuUcB4hohUkYTVRem7q5vUlSZq1iF40xwNSs1S6JDo656Xkl-73ZVph77YjBsm2Ph5ByGw7PgLjNDIUDOagnfH3ghYvaOMi739ssCJ5eeKbqE-0kPx-iQN1ZRcmk3VF8pw9kcdJ83nZRfNfzvx7kaUW8fW3oV42OI',
    category: 'classic'
  },
  {
    id: 'h4',
    title: 'Long Texture Flow',
    price: 60,
    duration: 75,
    description: 'Corte de alta classe para cabelos longos, aplicando camadas suaves de movimento.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4ZHWQiR3kQlUXZfbroOVSyQScivpq7ItHdWeJiL6LuaW0V0c3TBb-o40l_AR6Zj9XLOd4Ivi9aiuG2tbx32FHuXWcVChl9jV3Ob234ryFaWyydBTt2gtUEAS_qo-Ik9D_tTSAXR56hTKN6_neiVzzphWAvmvprgFRjpqrzIsHKvDquKggUWB0VLBktyo_pSc2nrGX_nqMTBREFDx28wNwRWeAzHjSs5D9XbofMaqblJ7GA1ZCj-VA5pqbuKnRCrY6pIZxOaj6RUs',
    category: 'long_hair'
  },
  {
    id: 'h5',
    title: 'Beard Sculpting',
    price: 30,
    duration: 25,
    description: 'Modelagem completa da barba com aplicação de óleos aromáticos e toalha vaporizada.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKrmxHHWjwGZtrN9CCS3oGzQegsjsszOmW9LPCn2cI7Vv_7r-uCXFPmgNE_jPLbWDC48L2hs10tUcMvgGfvzU8mHSVOVDBS1Jp-8KKFjRGaa-vY-1KraGau3JyZY1D2ZxV_AjSCn9Pew-RpbF1UYTqaa8xjQtB0L3PNjZVMBTeS9azCy3Fza0besR_PxoqmuZ5YjWJcAqzbsGnNAQZGPkqvxz7TYqYQwipUxYsUjC6jLB5gmZ86gp3zYy4jj3qoGdCKd_046mMFGI',
    category: 'beard'
  }
];

export const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: 'p1',
    name: 'Marcus',
    role: 'Master Barber',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDraxgZdvmEUem5HFMqIRpvGQQQzsh60qucgOEh6RP7Zkwbbqd6yLFIbANGVPRCvN0YjRNOighh3qZZfdQMjLSH-Kh9RhgbOSb-9ZvPfcBBI_CMf6R57IEwGIfgc6RkjokVjs0l-_Jk4T5TaoB_jOx0_mU8gK69NJIayUwGLrwAXBq9HUtiJr9sYjPNTbnoJSk--dQgfUGAARw1qhdTzf8Mm-V8cHO6RA4qxAyz3-eJf5-93bHc9K6aqAGyeQa18QZ1XF9xoHY2wg0'
  },
  {
    id: 'p2',
    name: 'Elena',
    role: 'Senior Stylist',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWiVOoTOTdxGcOpy-pglBlW8YezwwtZftEG4BcQvQ5-tNlE7yMWA9si7gUmlthl_54Apx_VS_ceLE9q14wqoS3sDVj2rzuf9n6uBBNzfyKaObdLwK_OOsVIRrRGMQrrkS2z8RQXVgHqk_9PlDZxLIbC7mvbS0AfXIMW4DhNWWlIOoPR4euUAmaDuDNg_uFICOOcl5XmJ3_D9HurvAYM6kdryBLIwGYJ76hNEEkKKKz4lJAOS6PujwHC5Yqq5fvQ5mHzJtZSQDSl-A'
  },
  {
    id: 'p3',
    name: 'Julian',
    role: 'Creative Director',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtHaRUcMsK38j68ogxKN7cE7yVBtQZGfID_aPfoff7cQqwVWN11YM6a_vouI3cpnF9LrSdocVB1WjZb4Pyy7d3pYBVfL62Qy10iyOswVYbSUsie_jV4MsGUk3E-5xJjPfAF41w_tqLMcxp2of9wgO46SRFljB0OrHpTy0puCtyGldyBkaFIovDMR_EEN3tjQUGFHS1a1EsR7GN-9lCaSAJygI9Yn7nvv-e6aBOSWIkydRpc1sj3gOG6v27PVWMP1Z1_z1f8Hdfgwc'
  },
  {
    id: 'p4',
    name: 'Sarah',
    role: 'Beard Expert',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh22bhYIpCqn6Rs8zWu9VMVzFCPXNrvP-FBp_ozBlQs35S7yIgvyFJWF58W-wA8fZfiGBiniKzbFbeg2ME43cZUXBd-9DYLuXLwq7fIC8yLqXINIAON_5WB4-N-yeXupNYJpby9s4u9ob50EFngWoUS-9wzqc-AwBsEZWU0L_jUiPIjqHPMvyVf0fHc2TLyb9vnHvsPLEKgQAghB1cgHoVzTKMzD6k52kl6ZDUSMV5dFJKeM8nwjMJ7ES_2HB_QirfUW6MC7enXaM'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    clientName: 'Thiago Silva',
    clientEmail: 'thiago.silva@gmail.com',
    clientPhone: '(11) 98844-3211',
    serviceId: 'h1',
    serviceName: 'Corte Degradê',
    professionalId: 'p1',
    professionalName: 'Marcus',
    date: '2026-10-12',
    timeSlot: '14:00',
    status: 'confirmed',
    price: 45,
    duration: 45
  },
  {
    id: 'b2',
    clientName: 'Gabriel Mendes',
    clientEmail: 'gabriel.mendes@gmail.com',
    clientPhone: '(21) 97722-4455',
    serviceId: 'h5',
    serviceName: 'Barba Completa',
    professionalId: 'p4',
    professionalName: 'Sarah',
    date: '2026-10-12',
    timeSlot: '15:00',
    status: 'pending',
    price: 30,
    duration: 30
  },
  {
    id: 'b3',
    clientName: 'Roberto Fontes',
    clientEmail: 'roberto.fontes@gmail.com',
    clientPhone: '(19) 96655-3221',
    serviceId: 'h2',
    serviceName: 'Combo Corte + Barba',
    professionalId: 'p2',
    professionalName: 'Elena',
    date: '2026-10-12',
    timeSlot: '16:15',
    status: 'confirmed',
    price: 85,
    duration: 75
  },
  {
    id: 'b4',
    clientName: 'Lucas Amaral',
    clientEmail: 'lucas.amaral@outlook.com',
    clientPhone: '(11) 95533-8877',
    serviceId: 'h3',
    serviceName: 'Corte Clássico',
    professionalId: 'p1',
    professionalName: 'Marcus',
    date: '2026-10-12',
    timeSlot: '17:30',
    status: 'confirmed',
    price: 35,
    duration: 45
  }
];

export const GENERAL_MOCK_CLIENTS: User[] = [
  {
    id: 'u1',
    name: 'Marcos de Souza',
    email: 'marcos@gmail.com',
    phone: '(11) 99123-4567',
    role: 'client',
    preferredStyle: 'fade',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXFR11Vg6lkCQyuDFDlYvqxjTfUcmHO9Go-kTATuzgFJolrLcZEDolKCpej8OgfyafeiNC3RCxarhq-_3bmTad0CrVlMMGyuuy-D6b0w2pn5BZfRbnP17yPaoacBpAurzQYT0goh2nWh-158T2S4_hoaLV9B80cgM_zi_XC-SX6NTsR8-rxtSkFpC1YZqoLcL65PI1AVyqiVkXLo_evuK6-mszt09RzMMTkIQyxkugttkVWhm1KThnjiomdN_fOzoG5NDr2MhRkTA'
  },
  {
    id: 'u2',
    name: 'Gabriel Mendes',
    email: 'gabriel.mendes@gmail.com',
    phone: '(21) 97722-4455',
    role: 'client',
    preferredStyle: 'social'
  }
];
