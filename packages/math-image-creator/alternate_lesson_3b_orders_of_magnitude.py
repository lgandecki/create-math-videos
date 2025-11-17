from manim import *
import numpy as np

class OrdersOfMagnitude(Scene):
    def construct(self):
        # Title
        title = Text("Rzędy Wielkości", font_size=48)
        subtitle = Text("Zbudowanie mostu 1 → 10 → 100 → 1000", font_size=24)
        subtitle.next_to(title, DOWN)
        
        self.play(Write(title))
        self.play(FadeIn(subtitle))
        self.wait(2)
        self.play(FadeOut(title, subtitle))

        # Start with human scale
        self.human_scale_zoom_out()
        
        # Clear and do zoom in
        self.play(*[FadeOut(mob) for mob in self.mobjects])
        self.wait()
        
        self.human_scale_zoom_in()
        
        # Final logarithmic scale
        self.play(*[FadeOut(mob) for mob in self.mobjects])
        self.wait()
        self.final_logarithmic_scale()

    def human_scale_zoom_out(self):
        # Initial number line
        axis = NumberLine(
            x_range=[0, 10, 1],
            length=10,
            include_numbers=True,
            font_size=20
        ).shift(DOWN * 2)
        
        # Human at 1m
        human = self.create_human().scale(0.5)
        human_pos = axis.n2p(1)
        human.move_to(human_pos + UP * 1)
        
        label_1m = Text("10⁰ m = 1m", font_size=16).next_to(human, UP)
        human_label = Text("Człowiek", font_size=14).next_to(human, DOWN, buff=0.5)
        
        self.play(
            Create(axis),
            FadeIn(human),
            Write(label_1m),
            Write(human_label)
        )
        self.wait()

        # Zoom out to 100m
        new_axis = NumberLine(
            x_range=[0, 100, 10],
            length=10,
            include_numbers=True,
            font_size=20,
            numbers_to_include=[0, 10, 50, 100]
        ).shift(DOWN * 2)
        
        # House at 10m
        house = self.create_house().scale(0.3)
        house_pos = new_axis.n2p(10)
        house.move_to(house_pos + UP * 1)
        
        # Stadium at 100m
        stadium = self.create_stadium().scale(0.4)
        stadium_pos = new_axis.n2p(100)
        stadium.move_to(stadium_pos + UP * 1)
        
        label_10m = Text("10¹ m", font_size=16).next_to(house, UP)
        label_100m = Text("10² m", font_size=16).next_to(stadium, UP)
        house_label = Text("Dom", font_size=14).next_to(house, DOWN, buff=0.5)
        stadium_label = Text("Boisko", font_size=14).next_to(stadium, DOWN, buff=0.5)
        
        # Make human tiny
        tiny_human = human.copy().scale(0.1)
        tiny_human.move_to(new_axis.n2p(1) + UP * 0.5)
        
        self.play(
            Transform(axis, new_axis),
            Transform(human, tiny_human),
            FadeOut(label_1m, human_label),
            FadeIn(house, label_10m, house_label),
            FadeIn(stadium, label_100m, stadium_label)
        )
        self.wait()

        # Zoom out to city scale (1000m)
        city_axis = NumberLine(
            x_range=[0, 1000, 100],
            length=10,
            include_numbers=False,
            font_size=20
        ).shift(DOWN * 2)
        
        # Add custom labels
        labels = VGroup()
        for val in [0, 100, 500, 1000]:
            label = Text(str(val), font_size=16)
            label.next_to(city_axis.n2p(val), DOWN)
            labels.add(label)
        
        # City at 1000m
        city = self.create_city().scale(0.5)
        city_pos = city_axis.n2p(1000)
        city.move_to(city_pos + UP * 1)
        
        label_1km = Text("10³ m = 1km", font_size=16).next_to(city, UP)
        city_label = Text("Miasto", font_size=14).next_to(city, DOWN, buff=0.5)
        
        # Previous objects become dots
        house_dot = Dot(city_axis.n2p(10) + UP * 0.5, radius=0.03)
        stadium_dot = Dot(city_axis.n2p(100) + UP * 0.5, radius=0.05)
        
        self.play(
            Transform(axis, city_axis),
            Write(labels),
            Transform(house, house_dot),
            Transform(stadium, stadium_dot),
            FadeOut(human, label_10m, label_100m, house_label, stadium_label),
            FadeIn(city, label_1km, city_label)
        )
        self.wait()

        # Continue to Earth and Solar System
        self.zoom_to_cosmic_scale()

    def zoom_to_cosmic_scale(self):
        # Earth scale
        earth_text = Text("10⁷ m = Ziemia", font_size=32)
        earth = Circle(radius=1.5, color=BLUE, fill_opacity=0.7)
        earth_group = VGroup(earth, earth_text.next_to(earth, DOWN))
        
        self.play(
            FadeOut(*self.mobjects),
            FadeIn(earth_group)
        )
        self.wait()
        
        # Solar System scale
        solar_text = Text("10¹² m = Układ Słoneczny", font_size=32)
        
        # Earth becomes a tiny dot
        earth_dot = Dot(radius=0.02, color=BLUE)
        sun = Circle(radius=0.5, color=YELLOW, fill_opacity=0.8)
        orbits = VGroup()
        for r in [1, 1.5, 2, 2.5]:
            orbit = Circle(radius=r, stroke_width=1, stroke_opacity=0.3)
            orbits.add(orbit)
        
        solar_system = VGroup(sun, orbits, earth_dot.shift(RIGHT * 2))
        solar_text.next_to(solar_system, DOWN, buff=1)
        
        self.play(
            Transform(earth_group, solar_system),
            Write(solar_text)
        )
        self.wait(2)

    def human_scale_zoom_in(self):
        # Start again with human
        human = self.create_human()
        label_1m = Text("1m = 10⁰ m", font_size=24).next_to(human, UP)
        human_label = Text("Człowiek", font_size=20).next_to(human, DOWN)
        
        self.play(
            FadeIn(human),
            Write(label_1m),
            Write(human_label)
        )
        self.wait()

        # Zoom to hand (0.1m)
        hand = self.create_hand().scale(2)
        label_01m = Text("0.1m = 10⁻¹ m", font_size=24).next_to(hand, UP)
        hand_label = Text("Dłoń", font_size=20).next_to(hand, DOWN)
        
        self.play(
            Transform(human, hand),
            Transform(label_1m, label_01m),
            Transform(human_label, hand_label)
        )
        self.wait()

        # Continue zooming to microscopic
        # Cell (10⁻⁵ m)
        cell = Circle(radius=1, color=GREEN, fill_opacity=0.3)
        nucleus = Circle(radius=0.3, color=DARK_BROWN, fill_opacity=0.5)
        nucleus.move_to(cell.get_center())
        cell_group = VGroup(cell, nucleus)
        
        label_cell = Text("10⁻⁵ m", font_size=24).next_to(cell_group, UP)
        cell_label = Text("Komórka", font_size=20).next_to(cell_group, DOWN)
        
        self.play(
            Transform(human, cell_group),
            Transform(label_1m, label_cell),
            Transform(human_label, cell_label)
        )
        self.wait()

        # Bacteria (10⁻⁶ m)
        bacteria = Ellipse(width=1.5, height=0.6, color=PURPLE, fill_opacity=0.4)
        label_bacteria = Text("10⁻⁶ m", font_size=24).next_to(bacteria, UP)
        bacteria_label = Text("Bakteria", font_size=20).next_to(bacteria, DOWN)
        
        self.play(
            Transform(human, bacteria),
            Transform(label_1m, label_bacteria),
            Transform(human_label, bacteria_label)
        )
        self.wait()

        # DNA (10⁻⁹ m)
        dna = self.create_dna_helix().scale(0.5)
        label_dna = Text("10⁻⁹ m", font_size=24).next_to(dna, UP)
        dna_label = Text("DNA", font_size=20).next_to(dna, DOWN)
        
        self.play(
            Transform(human, dna),
            Transform(label_1m, label_dna),
            Transform(human_label, dna_label)
        )
        self.wait(2)

    def final_logarithmic_scale(self):
        # Title
        title = Text("Skala Logarytmiczna: Cały Zakres", font_size=36)
        title.to_edge(UP)
        self.play(Write(title))

        # Create logarithmic axis
        log_axis = Line(LEFT * 6, RIGHT * 6).shift(DOWN * 0.5)
        
        # Add tick marks and labels
        scales = [
            (-9, "DNA\n10⁻⁹m", PURPLE),
            (-6, "Bakteria\n10⁻⁶m", PURPLE),
            (-5, "Komórka\n10⁻⁵m", GREEN),
            (-1, "Dłoń\n10⁻¹m", ORANGE),
            (0, "Człowiek\n10⁰m", WHITE),
            (1, "Dom\n10¹m", BLUE),
            (2, "Boisko\n10²m", BLUE),
            (3, "Miasto\n10³m", YELLOW),
            (7, "Ziemia\n10⁷m", BLUE),
            (12, "Układ\nSłoneczny\n10¹²m", YELLOW)
        ]
        
        self.play(Create(log_axis))
        
        # Position based on logarithmic scale
        for power, label_text, color in scales:
            # Map power to position on axis
            if power >= -9 and power <= 12:
                pos = log_axis.get_start() + RIGHT * ((power + 9) / 21 * 12)
                
                # Tick mark
                tick = Line(pos + UP * 0.1, pos + DOWN * 0.1, stroke_width=2)
                
                # Label
                label = Text(label_text, font_size=12, color=color)
                if power < 0:
                    label.next_to(tick, DOWN, buff=0.3)
                else:
                    label.next_to(tick, UP, buff=0.3)
                
                # Small icon
                if power == 0:
                    icon = self.create_human().scale(0.1)
                elif power == -9:
                    icon = self.create_dna_helix().scale(0.05)
                elif power == 7:
                    icon = Circle(radius=0.1, color=BLUE, fill_opacity=0.7)
                else:
                    icon = Dot(radius=0.05, color=color)
                
                icon.next_to(label, UP if power < 0 else DOWN, buff=0.1)
                
                self.play(
                    Create(tick),
                    Write(label),
                    FadeIn(icon),
                    run_time=0.5
                )
        
        # Final message
        message = Text(
            "21 rzędów wielkości na jednej osi!",
            font_size=28,
            color=GREEN
        ).to_edge(DOWN)
        
        self.play(Write(message))
        self.wait(3)

    def create_human(self):
        # Simple stick figure
        head = Circle(radius=0.2, color=WHITE)
        body = Line(head.get_bottom(), head.get_bottom() + DOWN * 0.8)
        left_arm = Line(body.get_center(), body.get_center() + LEFT * 0.3 + DOWN * 0.2)
        right_arm = Line(body.get_center(), body.get_center() + RIGHT * 0.3 + DOWN * 0.2)
        left_leg = Line(body.get_bottom(), body.get_bottom() + LEFT * 0.2 + DOWN * 0.5)
        right_leg = Line(body.get_bottom(), body.get_bottom() + RIGHT * 0.2 + DOWN * 0.5)
        
        return VGroup(head, body, left_arm, right_arm, left_leg, right_leg)

    def create_house(self):
        # Simple house shape
        base = Square(side_length=1)
        roof = Triangle().scale(0.7).next_to(base, UP, buff=0)
        door = Rectangle(width=0.2, height=0.4, fill_color=DARK_BROWN, fill_opacity=1)
        door.move_to(base.get_bottom() + UP * 0.2)
        
        return VGroup(base, roof, door)

    def create_stadium(self):
        # Simple oval stadium
        stadium = Ellipse(width=2, height=1, stroke_width=3)
        field = Ellipse(width=1.6, height=0.7, fill_color=GREEN, fill_opacity=0.5)
        field.move_to(stadium.get_center())
        
        return VGroup(stadium, field)

    def create_city(self):
        # Simple city skyline
        buildings = VGroup()
        heights = [0.5, 0.8, 1.2, 0.9, 0.7, 1.0, 0.6]
        x_pos = -1.5
        
        for h in heights:
            building = Rectangle(width=0.4, height=h, fill_color=GRAY, fill_opacity=0.7)
            building.align_to(ORIGIN, DOWN)
            building.shift(RIGHT * x_pos)
            buildings.add(building)
            x_pos += 0.5
        
        return buildings

    def create_hand(self):
        # Simple hand outline
        palm = Ellipse(width=0.8, height=1, fill_color=LIGHT_BROWN, fill_opacity=0.3)
        fingers = VGroup()
        for i in range(5):
            finger = Ellipse(width=0.15, height=0.4)
            angle = -PI/6 + i * PI/12
            finger.shift(palm.get_top() + 0.2 * (UP * np.cos(angle) + RIGHT * np.sin(angle)))
            fingers.add(finger)
        
        return VGroup(palm, fingers)

    def create_dna_helix(self):
        # Simple DNA double helix
        helix1 = ParametricFunction(
            lambda t: np.array([0.5 * np.cos(2 * t), t, 0.5 * np.sin(2 * t)]),
            t_range=[-2, 2],
            color=BLUE
        )
        helix2 = ParametricFunction(
            lambda t: np.array([0.5 * np.cos(2 * t + PI), t, 0.5 * np.sin(2 * t + PI)]),
            t_range=[-2, 2],
            color=RED
        )
        
        # Add some connecting lines
        connections = VGroup()
        for t in np.linspace(-2, 2, 8):
            start = np.array([0.5 * np.cos(2 * t), t, 0.5 * np.sin(2 * t)])
            end = np.array([0.5 * np.cos(2 * t + PI), t, 0.5 * np.sin(2 * t + PI)])
            line = Line(start, end, stroke_width=1, stroke_opacity=0.5)
            connections.add(line)
        
        return VGroup(helix1, helix2, connections)