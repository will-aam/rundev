import Image from "next/image";
import { FiMapPin, FiMail, FiLink } from "react-icons/fi";
import { SiInstagram } from "react-icons/si";

const profileData = {
  name: "Will",
  // username: "will_dev",
  bio: "ᴀɴᴀʟɪꜱᴛᴀ ᴅᴇ ᴅᴀᴅᴏꜱ | ᴇɴɢᴇɴʜᴇɪʀᴏ ᴅᴇ ꜱᴏꜰᴛᴡᴀʀᴇ.",
  // Coloque o link real da sua foto aqui (ex: o seu perfil do github com .png no final)
  avatarUrl: "https://github.com/will-aam.png",
  location: "Aracaju, Sergipe, Brasil",
  email: "will00987654@gmail.com",
  socials: [
    {
      name: "Instagram",
      icon: SiInstagram,
      url: "https://instagram.com/will.aam",
    },
    { name: "Portfólio", icon: FiLink, url: "https://seusite.com" },
  ],
  // Aqui você cola os links das imagens/badges que você baixar
  achievements: [
    {
      name: "Google Cloud Badge",
      imageUrl:
        "https://www.gstatic.com/images/branding/product/2x/google_cloud_64dp.png",
    },
    { name: "Credential 2", imageUrl: "https://via.placeholder.com/48" },
  ],
};

export function ProfileSidebar() {
  return (
    <aside className="w-80 h-fit flex flex-col gap-8 py-4">
      {/* SEÇÃO 1: Avatar (Centralizado) e Nome (Esquerda) */}
      <div className="flex flex-col gap-4 items-start text-left w-full">
        <div className="relative w-64 h-64 rounded-full overflow-hidden self-center md:self-start border-2 border-border shadow-sm">
          <Image
            src={profileData.avatarUrl} // A imagem agora vem dinamicamente do objeto acima
            alt={profileData.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="w-full">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {profileData.name}
          </h1>
          {/* <p className="text-xl text-muted-foreground">
            @{profileData.username}
          </p>*/}
        </div>
      </div>

      {/* SEÇÃO 2: Bio */}
      <div className="text-muted-foreground text-base text-left">
        <p>{profileData.bio}</p>
      </div>

      {/* SEÇÃO 3: Info estilo GitHub (Alinhado à Esquerda) */}
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex items-center gap-2 text-foreground">
          <FiMapPin className="h-4 w-4 text-muted-foreground" />
          <span>{profileData.location}</span>
        </div>

        <a
          href={`mailto:${profileData.email}`}
          className="flex items-center gap-2 hover:underline"
        >
          <FiMail className="h-4 w-4 text-muted-foreground" />
          <span>{profileData.email}</span>
        </a>

        {profileData.socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline group"
          >
            <social.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="font-medium">{social.name}</span>
          </a>
        ))}
      </div>

      {/* SEÇÃO 4: Conquistas (Com links de imagens) */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground border-t border-border pt-4">
          Conquistas
        </h2>
        <div className="flex flex-wrap gap-3">
          {profileData.achievements.map((badge) => (
            <div
              key={badge.name}
              title={badge.name}
              className="relative w-12 h-12"
            >
              <img
                src={badge.imageUrl}
                alt={badge.name}
                className="w-full h-full object-contain hover:scale-110 transition-transform cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
