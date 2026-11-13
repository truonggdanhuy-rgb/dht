-- Chạy 1 lần trong Supabase: SQL Editor > New query > dán toàn bộ > Run.
-- Có thể chạy lại nhiều lần mà không lỗi.

-- ============ 1) Mỗi tài khoản DHT chỉ đăng nhập 1 thiết bị ============
create table if not exists public.devices(
  user_id   uuid primary key references auth.users(id) on delete cascade,
  device_id text not null,
  seen      timestamptz not null default now()
);
alter table public.devices enable row level security;   -- không tạo policy: chỉ hàm bên dưới được đụng vào

-- true  = thiết bị này được dùng tài khoản (chưa ai giữ, hoặc chính nó đang giữ, hoặc người giữ đã im quá 5 phút)
-- false = có thiết bị khác đang giữ
create or replace function public.claim_device(d text) returns boolean
language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() is null then return false; end if;
  insert into public.devices(user_id,device_id,seen) values(auth.uid(),d,now())
  on conflict (user_id) do update set device_id=excluded.device_id, seen=now()
    where public.devices.device_id=excluded.device_id or public.devices.seen < now()-interval '5 minutes';
  return exists(select 1 from public.devices where user_id=auth.uid() and device_id=d);
end $$;

create or replace function public.release_device(d text) returns void
language sql security definer set search_path=public as $$
  delete from public.devices where user_id=auth.uid() and device_id=d;
$$;

-- ============ 2) Lì xì (tặng Xu) ở Công viên Tinyland ============
create table if not exists public.gifts(
  id        bigint generated always as identity primary key,
  from_user uuid not null,
  from_name text,
  to_user   uuid not null,
  amount    int  not null check (amount > 0),
  created   timestamptz not null default now(),
  claimed   boolean not null default false
);
create index if not exists gifts_to_idx on public.gifts(to_user) where not claimed;
alter table public.gifts enable row level security;     -- không tạo policy

create or replace function public.send_gift(p_to uuid, p_amount int, p_name text) returns boolean
language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() is null or p_to is null or p_to=auth.uid() or p_amount<1 or p_amount>1000000 then return false; end if;
  if not exists(select 1 from auth.users where id=p_to) then return false; end if;
  if (select count(*) from public.gifts where from_user=auth.uid() and created>now()-interval '1 minute')>=20 then return false; end if;
  insert into public.gifts(from_user,from_name,to_user,amount)
    values(auth.uid(), left(coalesce(nullif(trim(p_name),''),'Ai đó'),16), p_to, p_amount);
  return true;
end $$;

-- người nhận gọi hàm này: lấy hết lì xì chưa nhận, đánh dấu đã nhận, trả về [{n:tên, a:số xu}]
create or replace function public.claim_gifts() returns jsonb
language plpgsql security definer set search_path=public as $$
declare r jsonb;
begin
  if auth.uid() is null then return '[]'::jsonb; end if;
  with u as (update public.gifts set claimed=true where to_user=auth.uid() and not claimed returning from_name, amount)
  select coalesce(jsonb_agg(jsonb_build_object('n',from_name,'a',amount)),'[]'::jsonb) into r from u;
  return r;
end $$;

-- chỉ người đã đăng nhập mới gọi được các hàm này
revoke all on function public.claim_device(text), public.release_device(text), public.send_gift(uuid,int,text), public.claim_gifts() from public, anon;
grant execute on function public.claim_device(text), public.release_device(text), public.send_gift(uuid,int,text), public.claim_gifts() to authenticated;

-- ============ 3) (Tùy chọn) Xóa dữ liệu cũ của game Phố ============
delete from public.saves where game='pho';
