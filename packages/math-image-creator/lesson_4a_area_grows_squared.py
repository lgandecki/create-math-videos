from manim import *

class AreaGrowsSquared(Scene):
    def construct(self):
        # Title
        title = Text("Pole rośnie z kwadratem długości", font_size=48)
        subtitle = Text("Area grows with length²", font_size=24, color=GRAY)
        title_group = VGroup(title, subtitle).arrange(DOWN)
        self.play(Write(title), FadeIn(subtitle))
        self.wait(1)
        self.play(FadeOut(title_group))

        # Create small pizza
        small_radius = 1.5
        small_pizza = Circle(radius=small_radius, color=ORANGE, fill_opacity=0.3, stroke_width=3)
        small_pizza.shift(LEFT * 3.5)
        
        # Label for small pizza
        small_diameter_label = VGroup(
            Text("Średnica:", font_size=20),
            Text("20 cm", font_size=24, color=ORANGE)
        ).arrange(DOWN, buff=0.1)
        small_diameter_label.next_to(small_pizza, DOWN, buff=0.5)
        
        # Show small pizza
        self.play(Create(small_pizza), Write(small_diameter_label))
        self.wait(0.5)

        # Add salami slices to small pizza
        salami_radius = 0.2
        salami_positions = [
            [0, 0],
            [0.5, 0.5], [-0.5, 0.5], [0.5, -0.5], [-0.5, -0.5],
            [0.7, 0], [-0.7, 0], [0, 0.7]
        ]
        
        small_salamis = VGroup()
        for pos in salami_positions:
            salami = Circle(
                radius=salami_radius,
                color=RED,
                fill_opacity=0.8,
                stroke_width=1
            )
            salami.move_to(small_pizza.get_center() + np.array([pos[0], pos[1], 0]))
            small_salamis.add(salami)
        
        salami_label = Text("8 plasterków salami", font_size=18, color=RED)
        salami_label.next_to(small_pizza, UP, buff=0.5)
        
        self.play(
            LaggedStart(*[FadeIn(s) for s in small_salamis], lag_ratio=0.1),
            Write(salami_label)
        )
        
        # Price label for small pizza
        small_price = Text("Cena: 20 PLN", font_size=24, color=GREEN)
        small_price.next_to(small_diameter_label, DOWN, buff=0.3)
        self.play(Write(small_price))
        self.wait(1)

        # Create large pizza
        large_radius = small_radius * 2
        large_pizza = Circle(radius=large_radius, color=ORANGE, fill_opacity=0.3, stroke_width=3)
        large_pizza.shift(RIGHT * 3.5)
        
        # Label for large pizza
        large_diameter_label = VGroup(
            Text("Średnica:", font_size=20),
            Text("40 cm", font_size=24, color=ORANGE)
        ).arrange(DOWN, buff=0.1)
        large_diameter_label.next_to(large_pizza, DOWN, buff=0.5)
        
        # Show large pizza
        self.play(Create(large_pizza), Write(large_diameter_label))
        
        # Add 2x indicator
        times_two = Text("2× większa średnica", font_size=28, color=YELLOW)
        times_two.move_to(UP * 3)
        self.play(Write(times_two))
        
        # Question mark for price
        large_price_question = Text("Cena: ??", font_size=24, color=GRAY)
        large_price_question.next_to(large_diameter_label, DOWN, buff=0.3)
        self.play(Write(large_price_question))
        self.wait(1)

        # Start adding salami to large pizza
        # We need 4x as many (32 total)
        large_salami_count = 0
        large_salamis = VGroup()
        
        # Create a grid of positions for 32 salamis
        grid_size = 6
        spacing = (large_radius * 1.6) / grid_size
        
        salami_counter = Text("Plasterki: 0", font_size=20, color=RED)
        salami_counter.next_to(large_pizza, UP, buff=0.5)
        self.play(Write(salami_counter))
        
        # Animate adding salamis in batches
        for row in range(grid_size):
            for col in range(grid_size):
                x = (col - grid_size/2 + 0.5) * spacing
                y = (row - grid_size/2 + 0.5) * spacing
                
                # Check if position is within the pizza circle
                if x**2 + y**2 <= (large_radius - salami_radius)**2:
                    salami = Circle(
                        radius=salami_radius,
                        color=RED,
                        fill_opacity=0.8,
                        stroke_width=1
                    )
                    salami.move_to(large_pizza.get_center() + np.array([x, y, 0]))
                    large_salamis.add(salami)
                    large_salami_count += 1
        
        # Animate adding salamis quickly
        self.play(
            LaggedStart(*[FadeIn(s) for s in large_salamis[:8]], lag_ratio=0.05),
            salami_counter.animate.become(Text("Plasterki: 8", font_size=20, color=RED).move_to(salami_counter)),
            run_time=1
        )
        
        self.play(
            LaggedStart(*[FadeIn(s) for s in large_salamis[8:16]], lag_ratio=0.05),
            salami_counter.animate.become(Text("Plasterki: 16", font_size=20, color=RED).move_to(salami_counter)),
            run_time=0.8
        )
        
        # Speed up for the rest
        self.play(
            LaggedStart(*[FadeIn(s) for s in large_salamis[16:]], lag_ratio=0.01),
            salami_counter.animate.become(Text("Plasterki: 32", font_size=20, color=RED).move_to(salami_counter)),
            run_time=1
        )
        
        # Reveal the price
        self.wait(0.5)
        
        # Cross out old price and show new
        old_price_cross = Line(
            large_price_question.get_left(),
            large_price_question.get_right(),
            color=RED,
            stroke_width=3
        )
        
        new_price = Text("Cena: 80 PLN", font_size=24, color=GREEN)
        new_price.next_to(large_diameter_label, DOWN, buff=0.3)
        
        self.play(
            Create(old_price_cross),
            Transform(large_price_question, new_price)
        )
        
        # Show the relationship
        relationship = VGroup(
            Text("Długość ×2", font_size=32),
            Text("→", font_size=48),
            Text("Pole ×4 (2²)", font_size=32, color=YELLOW)
        ).arrange(RIGHT, buff=0.3)
        relationship.to_edge(DOWN, buff=1)
        
        # Add visual emphasis
        small_area_label = Text("A = πr²", font_size=24).next_to(small_pizza, RIGHT, buff=0.3)
        large_area_label = Text("A = π(2r)² = 4πr²", font_size=24).next_to(large_pizza, LEFT, buff=0.3)
        
        self.play(
            Write(small_area_label),
            Write(large_area_label),
            Write(relationship)
        )
        
        # Highlight the 4x relationship
        four_x = Text("4×", font_size=72, color=YELLOW)
        four_x.move_to(ORIGIN)
        
        self.play(
            FadeIn(four_x, scale=2),
            small_pizza.animate.set_opacity(0.1),
            large_pizza.animate.set_opacity(0.1),
            *[s.animate.set_opacity(0.1) for s in small_salamis],
            *[s.animate.set_opacity(0.1) for s in large_salamis],
        )
        
        self.wait(2)